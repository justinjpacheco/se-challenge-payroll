bash "update system software" do
  code <<-EOF
    apt update && apt full-upgrade -y
  EOF
end

package 'npm'
package 'nginx'
package 'python-dev'
package 'python-virtualenv'
package 'mysql-server'
package 'libmysqlclient-dev'

service 'nginx' do
  supports :restart => true
end

# some npm modules look for /usr/bin/node instead of nodejs.
#
link '/usr/bin/node' do
  to '/usr/bin/nodejs'
end

cookbook_file '/etc/nginx/sites-available/default' do
  source 'nginx-default.conf'
  notifies :restart, 'service[nginx]', :immediately
end

cookbook_file '/tmp/payroll-db.sql' do
  source 'payroll-db.sql'
  notifies :run, 'bash[create database]', :immediately
end

bash 'create database' do
  action :nothing
  code <<-EOH
    mysql < /tmp/payroll-db.sql
    rm /tmp/payroll-db.sql
  EOH
end

# npm wants to chown the files after it downloads and installs them. this
# doesn't work to well over nfs mounted directores. to get around this, we'll
# download/install the node_modules locally and copy the contents back to the
# nfs share
#
bash 'build client' do
  code <<-EOH
    set -e
    mkdir -p /tmp/npm-build
    cp /vagrant/src/client/package.json /tmp/npm-build/
    cd /tmp/npm-build && npm install
    rsync -rlzuIO --ignore-errors /tmp/npm-build/node_modules/ \
      /vagrant/src/client/node_modules > /dev/null 2>&1
    rm -rf /tmp/npm-build
    cd '/vagrant/src/client'
    npm run build
  EOH
end

directory '/vagrant/dist/server' do
  recursive true
end

directory '/etc/payroll' do
  recursive true
end

cookbook_file '/etc/payroll/payroll.conf' do
  source 'payroll.conf'
end

cookbook_file '/tmp/db-sync.py' do
  source 'db-sync.py'
  notifies :run, 'bash[build and run server]', :immediately
end

bash 'build and run server' do
  action :nothing
  cwd '/vagrant/dist/server'
  code <<-EOH
    set -e
    virtualenv env
    . env/bin/activate
    pip install -e /vagrant/src/server
    python /tmp/db-sync.py
    FLASK_APP=/vagrant/src/server/payrollapi/app.py flask run &
  EOH
end
