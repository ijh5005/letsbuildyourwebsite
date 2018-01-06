"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', 'navigate', 'data', function($scope, navigate, data){
  $scope.navigationPoints = data.navigationPoints;
  $scope.bringToTopOfPage = (e, dataValue) => {
    debugger
    (dataValue === undefined) ? navigate.toTag(e) : navigate.toTagWithDataValue(dataValue);
  }
}])

app.service('navigate', function(){
  this.toTag = (e) => {
    const attributes = e.currentTarget.attributes;
    const dataAttributeNodeValue = attributes.data.nodeValue;
    const selector = $(".textHeading[data=" + dataAttributeNodeValue + "]");
    const offsetTop = parseInt(selector[0].offsetTop);
    const element = document.getElementById('mainContent');
    element.scrollTop = offsetTop - 140;
  }
  this.toTagWithDataValue = (dataValue) => {
    const selector = $("div[data=" + dataValue + "]");
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
