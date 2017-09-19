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
