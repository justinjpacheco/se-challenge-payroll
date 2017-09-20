bash "update system software" do
  code <<-EOF
    apt update && apt full-upgrade -y
  EOF
end

package 'npm'
package 'nginx'
package 'python-dev'
package 'nodejs-legacy'
package 'python-virtualenv'
package 'mysql-server'
package 'libmysqlclient-dev'

service 'nginx' do
  supports :restart => true
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

bash 'build client' do
  cwd '/vagrant/src/client'
  code <<-EOH
    set -e
    npm install
    npm run build
  EOH
end

directory '/vagrant/dist/server' do
  recursive true
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
