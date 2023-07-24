FROM node:18 as development


WORKDIR /app


COPY package*.json .

RUN npm i

COPY . .
############################################################################
############################################################################
############################################################################
ENV NODE_ENV=development
ENV PORT=4000
ENV DATABASE=mongodb+srv://ayoubjemai100:<PASSWORD>@socialmediatest.afdwrdx.mongodb.net/node-ts
ENV DATABASE_PASSWORD=jemai2003


ENV ACCESS_JWT_SECRET=YzEzMGdoMHJnOHBiOG1ibDhyNTA
ENV REFRECH_JWT_SECRET=1C5CHFA_enTN1029TN1029&sxsrf=APwXEdfILEvkkygC9MZ__xWwjY7VtIhZyQ%3A1681202976456&ei=IB81ZLSyG7eukdUPxbyJ6AQ&ved=0ahUKEwi0wtORuaH-AhU3V6QEHUVeAk0Q4dUDCA8&uact=5&oq=token+access+privat+key+example&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIKCCEQoAEQwwQQCjoKCAAQRxDWBBCwAzoGCAAQBxAeOggIABAIEAcQHjoHCCMQsAIQJzoGCAAQHhAPOgYIABAIEB46CAgAEAUQBxAeOggIABCKBRCGAzoECAAQHjoGCAAQBRAeOgUIABCiBDoICCEQoAEQwwRKBAhBGABQ_xJY2khg7UtoAnAAeACAAYwBiAHjFpIBBDAuMjSYAQCgAQHIAQjAAQE
ENV JWT_EXPIRES_IN=90d
ENV JWT_COOKIE_EXPIRES_IN=90

ENV DEFAULT_PAGE_SIZE=10
ENV DEFAULT_PAGE_NUMBER=1


ENV JWT_REFRESH_EXPIRES_TIME=90d
ENV JWT_ACCES_EXPIRES_TIME=15m


ENV PASSWORD_SALT=12

ENV EMAIL_USERNAME=eb8f0b5b4055f8
ENV EMAIL_PASSWORD=682cc550888524
ENV EMAIL_HOST=sandbox.smtp.mailtrap.io
ENV EMAIL_PORT=25

ENV CURRENT_JOB_PLACE=sofyline
ENV EMAIL_FROM=ayoubjemai99@gmail.com


ENV SENDGRID_USERNAME=ayoubjemai99@gmail.com
ENV SENDGRID_PASSWORD=XVtEN8Gw3AgspHLW

ENV SENDGRID_API_KEY=xsmtpsib-1c33e5c5ed1179187edb8c2618be8a2e1591297539e3daf4653406cf07b684ba-5Ikw0nsDh1ZyQ43K
ENV SENDGRID_HOST=smtp-relay.sendinblue.com
ENV SENDGRID_PORT=587


ENV WIDTH_USER_PROFILE=500
ENV HEIGHT_USER_PROFILE=500
ENV FORMAT_USER_PROFILE=jpeg
ENV QUALITY_USER_PROFILE=90

############################################################################
############################################################################
############################################################################

EXPOSE 4000


CMD [ "npm" , "start" ]