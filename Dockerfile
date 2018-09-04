FROM eu.gcr.io/tippiq-platform/node-base-6-9-1:node-6-9-1-b3

ENV \
  NODE_ENV=production \
  NPM_CONFIG_LOGLEVEL=error \
  NPM_CONFIG_PROGRESS=false

WORKDIR /opt/app

COPY . /opt/app

RUN \
  NODE_ENV=dev yarn && \
  yarn run build
# todo: 'yarn install -- production' failes, removed for now

EXPOSE 3007

ENTRYPOINT [ "yarn" ]

CMD [ "start" ]
