"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', 'navigate', 'data', 'task', function($rootScope, $scope, $interval, navigate, data, task){
  $rootScope.url = 'yourwebsite.com';
  $rootScope.messageSent = false;
  $rootScope.currentlySendingMessage = false;
  $rootScope.labelMessage = "";
  $rootScope.showLabelLabelMessage = false;
  $scope.messageType = 'email';
  $scope.emailStatus = 'selectedSendBtn';
  $scope.textStatus = '';
  $scope.navigationPoints = data.navigationPoints;
  $scope.services = data.services;
  $scope.changeMessageStatusToEmail = () => {
    $scope.messageType = 'email';
    $scope.emailStatus = 'selectedSendBtn';
    $scope.textStatus = '';
  }
  $scope.changeMessageStatusToText = () => {
    $scope.messageType = 'text';
    $scope.emailStatus = '';
    $scope.textStatus = 'selectedSendBtn';
  }
  $scope.bringToTopOfPage = (e, dataValue) => {
    (dataValue === undefined) ? navigate.toTagWithEvent(e) : navigate.toTagWithDataValue(dataValue);
  }
  $scope.sendMessage = () => {
    ($scope.messageType === 'email') ? task.sendMessage('email') : task.sendMessage('text');;
  }
  task.typeUrl();
  task.watchForTagAnimation();
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
    {service: "device friendly layout", price: "$25 each", description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions."},
    {service: "sign in/sign up", price: "$50", description: "Includes a sign in/sgin up forms page."},
    {service: "email notifications", price: "$50", description: "An application to email your customers things such as promotional sales. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "text notifications", price: "$50", description: "An application to text customers things such as appointment reminders and thank you notes. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "page animations", price: "$50", description: "Custom animation to help your website stand out and build a smooth customer experience."},
    {service: "contact and feedback forms", price: "$50", description: "A convenient way for customers to contact you with a feedback form and a contact form on a page of your website."}
  ]
})

app.service('task', function($rootScope, $timeout, $interval, animation, server){
  this.typeUrl = () => {
    $('.pageContent').hide();
    $(".url p").text('');
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
        i = 1;
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
  this.sendMessage = (messageType) => {
    if($rootScope.currentlySendingMessage){ return null }
    $rootScope.currentlySendingMessage = true;
    const first = $("#first").val();
    const contact = $("#contact").val();
    const message = $("#message").val();
    const sendObj = { first: first, contact: contact, message: message };
    const hasEmpytField = this.hasEmpytField(sendObj);
    if(hasEmpytField){
      $rootScope.labelMessage = "you must fill out all fields. thanks!";
      $rootScope.showLabelLabelMessage = true;
      $rootScope.currentlySendingMessage = false;
      $timeout(() => { $rootScope.showLabelLabelMessage = false; }, 4000);
      return null;
    }
    const sendEmail = () => {
      animation.sendSignal();
      server.sendEmail(sendObj);
      $timeout(() => { $rootScope.messageSent = true }, 6000);
    }
    const sendText = () => {
      animation.sendSignal();
      server.sendText(sendObj);
      $timeout(() => { $rootScope.messageSent = true }, 6000);
    }
    (messageType === 'email') ? sendEmail() : sendText();
  }
  this.hasEmpytField = (obj) => {
    const values = Object.values(obj);
    const hasEmptyField = values.includes("") || values.includes(undefined);
    return hasEmptyField;
  }
})

app.service('animation', function($rootScope, $timeout, $interval){
  this.tag = (selector) => {
    this.fadeIn(selector, 600)
  }
  this.fadeIn = (selector, duration) => {
    const animation = { top: 0, left: 0, right: 0, bottom: 0, opacity: 1 };
    const options = { duration: duration }
    $(selector).animate(animation, options);
  }
  this.sendSignal = () => {
    const selector = [".arrowOne", ".arrowTwo", ".arrowThree"];
    let index = 0;
    $('.screen').css('transform', 'rotateY(0deg)');
    const sendingMessage = $interval(() => {
      if($rootScope.messageSent){
        $interval.cancel(sendingMessage);
        $('.arrow').css('opacity', 0);
        $rootScope.messageSent = false;
        $rootScope.currentlySendingMessage = false;
        $('.deviceScreen').addClass('messageSent');

        //send label message
        $rootScope.labelMessage = "message sent!";
        $rootScope.showLabelLabelMessage = true;
        $timeout(() => { $rootScope.showLabelLabelMessage = false; }, 4000);

        $timeout(() => {
          $('.screen').css('transform', 'rotateY(90deg)');
          $('.deviceScreen').removeClass('messageSent');
        }, 4000);
      } else {
        (index === selector.length) ? index = 0 : null;
        $('.arrow').css('opacity', 0);
        $(selector[index]).css('opacity', 1);
        index++
      }
    }, 500);
  }
})

app.service('server', function($http){
  this.sendEmail = (obj) => {
    console.log('email');
    console.log(obj);
  }
  this.sendText = (obj) => {
    console.log('text');
    console.log(obj);
  }
})
