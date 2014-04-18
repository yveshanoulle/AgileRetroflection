/*global inject*/

"use strict";

describe('directive for twitter links', function () {
  var $compile;
  var $rootScope;

  beforeEach(module('retroflection'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('creates link for twitter name', function () {
    $rootScope.name = '@yveshanoulle';
    var element = $compile('<twitter-link name="name"></twitter-link>')($rootScope);
    $rootScope.$digest();
    expect(element[0].href).toMatch('http://twitter.com/yves');
  });

  it('creates no link for non twitter name', function () {
    $rootScope.name = 'yveshanoulle';
    var element = $compile('<twitter-link name="name"></twitter-link>')($rootScope);
    $rootScope.$digest();
    expect(element[0].href).toMatch('#');
    expect(element[0].href).not.toMatch('http://twitter.com/yves');
  });
});
