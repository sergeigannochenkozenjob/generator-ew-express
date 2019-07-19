# <%- applicationName %>

#### To build a development image and run it:
~~~~
yarn run dev
~~~~

#### To build and push a production image to the docker repository:
~~~~
./script/image.push.sh <version>
~~~~

#### To build a production image (without pushing):
~~~~
./script/image.build.sh <version>
~~~~

#### To run a production image locally:
~~~~
./script/image.run.sh
~~~~

#### To run integration tests in Docker:
~~~~
./script/integration-test.run.sh
~~~~

#### To build a production image and push to Heroku:
~~~~
./script/image.push.heroku.sh <version>
~~~~

#### To view Heroku logs:
~~~~
./script/log.heroku.sh
~~~~
