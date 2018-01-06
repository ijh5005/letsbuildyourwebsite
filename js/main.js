"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', 'navigate', 'data', 'task', function($rootScope, $scope, navigate, data, task){
  $rootScope.url = 'yourwebsite.com';
  $scope.navigationPoints = data.navigationPoints;
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
