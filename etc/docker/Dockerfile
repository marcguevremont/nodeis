FROM marcbachmann/libvips

MAINTAINER Marc Guevremont <mg@webs7.com>

# Install Redis
RUN   \
  apt-get -y -qq install python 
  
RUN \ 
  apt-get update \
  && apt-get install -y wget \
  && apt-get install -y g++

RUN \
  wget -O - http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz \
  | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
  --exclude="ChangeLog" -C "/usr/local"
  
#Keep to use npm install with redis and vips
#RUN \
#    rm -rf /var/lib/apt/lists/*

RUN mkdir /is
RUN mkdir /is/tmp
RUN mkdir /is/storage 


VOLUME /is/tmp
VOLUME /is/storage

# Set the working directory
WORKDIR   /src

EXPOSE 8080

CMD ["/bin/bash"]
#build command

# run command



#docker run -i -t --rm -p 8076:8080 -v `pwd`:/src -v /var/tmp/is:/is/tmp -v /home/marc/is:/is/storage --name="is"  is 