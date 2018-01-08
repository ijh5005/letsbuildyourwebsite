"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', 'navigate', 'data', 'task', function($rootScope, $scope, navigate, data, task){
  $rootScope.url = 'yourwebsite.com';
  $scope.navigationPoints = data.navigationPoints;
  $scope.services = data.services;
  $scope.bringToTopOfPage = (e, dataValue) => {
    (dataValue === undefined) ? navigate.toTagWithEvent(e) : navigate.toTagWithDataValue(dataValue);
  }
  task.typeUrl();
}])

app.service('navigate', function(){
  this.toTagWithEvent = (e) => {
    const dataValue = e.currentTarget.attributes.data.nodeValue;
    const selector = $(".textHeading[data=" + dataValue + "]");
    this.navigateTo(selector);
  }
  this.toTagWithDataValue = (dataValue) => {
    const selector = $("div[data=" + dataValue + "]");
    this.navigateTo(selector);
  }
  this.navigateTo = (selector) => {
    const offsetTop = parseInt(selector[0].offsetTop);
    const element = document.getElementById('mainContent');
    element.scrollTop = offsetTop - 140;
  }
});

app.service('data', function(){
  this.navigationPoints = [
    {data: 0, point: 'home'},
    {data: 1, point: 'service'},
    {data: 2, point: 'cost'},
    {data: 3, point: 'example'},
    {data: 4, point: 'contact'}
  ]
  this.services = [
    {service: "page", price: "$50", description: "Each page is currently $50 each. If you are just looking for a landing page $50 is a great deal."},
    {service: "cross platform layouts", price: "$50", description: "You will get a website optimized for desktop for free. Additional device optimizations will cost $50 each."},
    {service: "sign in/sign up", price: "$50", description: "A personalized site could help speed up the checkout process if the customer's personal information (such as address) is already populated in the shopping cart field. It could also help connect you with your customers better."},
    {service: "email notifications", price: "$50", description: "Email you custmoers with promotional sales and member's only deals for their customer loyalty."},
    {service: "text notifications", price: "$50", description: "Text customers with email reminder for appointments or exclusive sales you know that wouldn't want to miss."},
    {service: "payment/shopping cart", price: "$80", description: "Why have a business if you are not getting paid? This deal gets you a shopping cart page and payment service."},
    {service: "mini animations", price: "$50", description: "Help build a better user experience with smooth animations or just wow you customers with a very modern functioning website."},
    {service: "contact/feedback forms", price: "$50", description: "Would you like a convience way for your customers to contact you with any questions or concerns? This service sets up 2 contact forms (feedback and contact) on your website."}
  ]
})

app.service('task', function($rootScope, $timeout){
  this.typeUrl = () => {
    $('.pageContent').hide();
    let delayTimes = [100, 200, 300, 400];
    let i = 1;
    let didntEraseYet = true;
    const $selector = $(".url p");
    const typeText = () => {
      let text;
      if((i === 4) && didntEraseYet){
        i--;
        text = $rootScope.url.slice(0, i);
        didntEraseYet = false;
      } else {
        text = $rootScope.url.slice(0, i);
      }
      if(i === $rootScope.url.length + 1){
        console.log('done');
        $('.urlCircle').css('opacity', 0.6).addClass('urlClicked');
        $timeout(() => { $('.urlCircle').css('opacity', 1).removeClass('urlClicked') }, 200);
        $timeout(() => { $('.pageContent').fadeIn() }, 500);
      } else {
        i++;
        $selector.text(text);
        const delay = (Math.floor(Math.random() * 3) + 1) * 100;
        $timeout(() => { typeText() }, delay);
      }

    }
    $timeout(() => { typeText() }, 1000);
  }
})
