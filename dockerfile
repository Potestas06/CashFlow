FROM node:latest
WORKDIR /cashflow
COPY . CashFlow\build
RUN npm install -g serve
CMD ["serve", "-s", "wwwroot", "-l", "80"]
EXPOSE 80
EXPOSE 443
