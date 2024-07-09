FROM node:latest
WORKDIR /cashflow
COPY . /cashflow
RUN npm install -g serve
RUN npm install
RUN npm run build  # Ensure the build step is included if needed
CMD ["serve", "-s", "build", "-l", "80"]
EXPOSE 80
EXPOSE 443
