FROM marcbachmann/libvips

MAINTAINER Marc Guevremont <mg@webs7.com>

# Install Redis
RUN   \
  apt-get -y -qq install python 
  
RUN \ 
  apt-get update \
  && apt-get install -y -qq build-essential \ 
  && apt-get install -y -qq wget 

RUN \
  wget -O - http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz \
  | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
  --exclude="ChangeLog" -C "/usr/local"
  
RUN \
 npm install pm2 -g
 

RUN \
    rm -rf /var/lib/apt/lists/*

RUN mkdir /is
RUN mkdir /is/tmp
RUN mkdir /is/storage 

RUN mkdir /etc/nodeis

VOLUME /is/tmp
VOLUME /is/storage

# Set the working directory
WORKDIR   /src

EXPOSE 8080


ADD ./run.sh /tmp/run.sh

CMD ["/bin/bash", "/tmp/run.sh"]
#build command

# run command



#docker run -i -t --rm -p 8076:8080 -v `pwd`:/src -v /var/tmp/is:/is/tmp -v /home/marc/is:/is/storage --name="is"  webs7/nodeis 