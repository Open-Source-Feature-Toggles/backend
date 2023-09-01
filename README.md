# OSFT Web Application

## What is OSFT?

OSFT stands for 'Open Source Feature Toggles'. It is a small feature flagging service that allows developers to register and run highly performant feature toggles on their Javascript and React applications (for free!). Below is an example of an OSFT client running on a React YouTube Clone I built.   

<br/>
<br/>
<div align="center">
  <img src="https://hjacobs-rest-api-production.up.railway.app/osft/1440-gif" alt="osft-demo"/>
</div>

#### [Click here if you would like to see the full video of this example](https://hjacobs-rest-api-production.up.railway.app/osft/raw-video-example)  


#### Built With

<table>
  <tr>
    <td align="center" height="108" width="108">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg"
          width="48"
          height="48"
          alt="MongoDB"
        />
        <br /><strong>MongoDB</strong>
      </td>
     <td align="center" height="108" width="108">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
          width="48"
          height="48"
          alt="Redis"
        />
        <br /><strong>Redis</strong>
      </td>
      <td align="center" height="108" width="108">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg"
          width="48"
          height="48"
          alt="Javascript"
        />
        <br /><strong>Javascript</strong>
      </td>
      <td align="center" height="108" width="108">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
          width="48"
          height="48"
          alt="Express"
        />
        <br /><strong>Express</strong>
      </td>
      <td align="center" height="108" width="108">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
          width="48"
          height="48"
          alt="Jest"
        />
        <br /><strong>Jest</strong>
      </td>
    </tr>
</table>

#### Other Repositories that are part of OSFT

[JS-Client](https://github.com/DONTSTOPLOVINGMEBABY/Feature-Flagging-Client-API)
<br/>
[React SDK](https://github.com/DONTSTOPLOVINGMEBABY/Feature-Toggles-React-SDK)
<br/>
[Admin Website](https://github.com/DONTSTOPLOVINGMEBABY/Feature-Flagging-Admin-UI)
<br/>

## Running Locally

### 1. Installation

```bash
git clone git@github.com:DONTSTOPLOVINGMEBABY/Feature-Flagging-Server.git
cd Feature-Flagging-Server
npm install 
```

In order for this service to run optimally, it should be able to connect to a redis server that is installed locally on the host machine. Instructions on how to install redis on your machine can be found [here](https://redis.io/docs/getting-started/installation/).


### 2. Configure environment variables

The following three files are required to test the server, run it locally, and to run it in production. 

#### .env.development

```.env
# development
MONGO_DEVELOPMENT_STRING=''        ## Your MongoDB url 
REDIS_URL='redis://127.0.0.1:6379' ## This is what redis-server will broadcast to on default 
PORT=3000                          ## The port of the host machine that the server will listen on
ACCESS_SECRET=''                   ## A secure secret for user auth on the web app
REFRESH_SECRET=''                  ## A secure secret with which to hash user passwords in DB 
COOKIE_SIGNATURE=''                ## A secure secret to sign and decrypt cookies 
```

#### .env.production

```.env
# production
MONGO_DEVELOPMENT_STRING=''        ## Your MongoDB url 
REDIS_URL=''                       ## Provide the url assigned to your redis instance by your cloud provider 
PORT=3000                          ## The port of the host machine that the server will listen on
ACCESS_SECRET=''                   ## A secure secret for user auth web app
REFRESH_SECRET=''                  ## A secure secret with which to hash user passwords in DB 
COOKIE_SIGNATURE=''                ## A secure secret to sign and decrypt cookies 
```

#### .env.testing

```.env
# testing
ACCESS_SECRET=''                  ## These secrets won't actually be used to persist data,   
REFRESH_SECRET=''                 ## so how secure you make them is up to you
COOKIE_SIGNATURE=''
```

### 3. Running the server

First run: 
```bash
redis-server
```

Then, in a new terminal window: 

```bash
npm run dev     # development
npm run start   # production
npm test        # run tests
```
