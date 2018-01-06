"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', 'navigate', 'data', function($scope, navigate, data){
  $scope.navigationPoints = data.navigationPoints;
  $scope.bringToTopOfPage = (e, dataValue) => {
    (dataValue === undefined) ? navigate.toTag(e) : navigate.toTagWithDataValue(dataValue);
  }
}])

app.service('navigate', function(){
  this.toTag = (e) => {
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
