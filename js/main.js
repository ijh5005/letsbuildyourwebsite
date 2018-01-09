"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', 'navigate', 'data', 'task', function($rootScope, $scope, $interval, navigate, data, task){
  $rootScope.url = 'yourwebsite.com';
  $scope.navigationPoints = data.navigationPoints;
  $scope.services = data.services;
  $scope.bringToTopOfPage = (e, dataValue) => {
    (dataValue === undefined) ? navigate.toTagWithEvent(e) : navigate.toTagWithDataValue(dataValue);
  }
  task.typeUrl();
  task.watchForTagAnimation();
  // console.log(window);
  $interval(() => { console.log(); }, 1000)
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
    {service: "website pages", price: "$50 each", description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added."},
    {service: "payment/shopping cart", price: "$80", description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more."},
    {service: "device friendly layout", price: "$25 each", description: "Have a website that also looks great on mobile phones and tablets."},
    {service: "sign in/sign up", price: "$50", description: "Having an account connects you with your customers, gives them a since of ownerships, and offers them convenience such as faster checkout processes."},
    {service: "email notifications", price: "$50", description: "Email your customers with promotional sales and members’ only deals for their customer loyalty. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "text notifications", price: "$50", description: "Text customers with appointment reminders, thank you notes, and exclusive deals. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "page animations", price: "$50", description: "Customers spend more on easy to use websites. Animations build an easy and smooth feelings experience. They also look nice :)"},
    {service: "contact and feedback forms", price: "$50", description: "Offers a convenient way for customers to contact you with any questions any concerns. I will set up a feedback form and a contact form on any page of your website."}
  ]
})

app.service('task', function($rootScope, $timeout, $interval, animation){
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
  this.watchForTagAnimation = () => {
    const watchForAnimation = $interval(() => {
      const positionFromTopOfPage = $('.mainContent').scrollTop();
      if(positionFromTopOfPage > 800){
        $interval.cancel(watchForAnimation);
        animation.tag('.navTag');
      }
    })
  }
})

app.service('animation', function($timeout, $interval){
  this.tag = (selector) => {
    this.fadeIn(selector, 600)
  }
  this.fadeIn = (selector, duration) => {
    const animation = { top: 0, left: 0, right: 0, bottom: 0, opacity: 1 };
    const options = { duration: duration }
    $(selector).animate(animation, options);
  }
})
