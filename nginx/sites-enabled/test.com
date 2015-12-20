server {
  listen 80 default_server;
  #listen [::]:80 default_server ipv6only=on;
  server_name localhost;

  root   /webpack-angular-example/dist;
  index  index.html index.htm;

  # Make site accessible from http://localhost/

  #location / {
      # First attempt to serve request as file, then
      # as directory, then fall back to displaying a 404.
      # try_files $uri $uri/ /index.html;
      # Uncomment to enable naxsi on this location
      # include /etc/nginx/naxsi.rules
  #}

  #location / {
  #    root   /webpack-angular-example/dist;
  #    index  index.html index.htm;
  #}

  #location /api {
  #    #proxy_set_header Host $http_host;
  #    proxy_set_header X-Real-IP $remote_addr;
  #    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  #    proxy_set_header X-Forwarded-Proto $scheme;
  #    #proxy_set_header X-NginX-Proxy true;
  #
  #    proxy_pass http://127.0.0.1:3000;
  #    proxy_redirect off;
  #}

  location ~* /(api|socket\.io) {
      #proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      #proxy_set_header X-NginX-Proxy true;

      proxy_pass http://node:3000;
      proxy_redirect off;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }
}
