angular.module('pageslide-directive', [])

.directive('pageslide', ['$document',
    function ($document) {
        /* Return directive definition object */

        return {
            restrict: 'EAC',
            transclude: false,
            scope: {
                psOpen: '=?',
                psAutoClose: '=?',
                psSide: '@',
                psSpeed: '@',
                psClass: '@',
                psSize: '@',
                psSqueeze: '@',
                psCloak: '@',
                psPush: '@',
                psContainer: '@',
                psKeyListener: '@',
                psBodyClass: '@'
            },
            //template: '<div class="pageslide-content" ng-transclude></div>',
            link: function ($scope, el, attrs) {
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* Parameters */
                var param = {
                  bodyClass: $scope.psBodyClass || false,
                  className: $scope.psClass || 'ng-pageslide',
                  cloak: ($scope.psCloak && $scope.psCloak.toLowerCase() == 'false') ? false : true,
                  container: $scope.psContainer || false,
                  keyListener: Boolean($scope.psKeyListener) || false,
                  push: Boolean($scope.psPush) || false,
                  side: $scope.psSide || 'right',
                  size: $scope.psSize || '300px',
                  speed: $scope.psSpeed || '0.5',
                  squeeze: Boolean($scope.psSqueeze) || false,
                  zIndex: 1000 // Override with custom CSS
                };

                // Apply Class to the element
                el.addClass(param.className);

                /* DOM manipulation */
                var content = null;
                var slider = null;
                var body = (param.container && document.getElementById(param.container)) || document.body;

                function setBodyClass(value){
                    if (param.bodyClass) {
                        var bodyClass = param.className + '-body';
                        var bodyClassRe = new RegExp(' ' + bodyClass + '-closed| '  + bodyClass + '-open');
                        body.className = body.className.replace(bodyClassRe, '');
                        body.className += ' ' + bodyClass + '-' + value;
                    }
                }

                setBodyClass('closed');

                slider = el[0];

                // Check for div tag
                if (slider.tagName.toLowerCase() !== 'div' && slider.tagName.toLowerCase() !== 'pageslide') {
                    throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');
                }

                // Check for content
                if (slider.children.length === 0) {
                    throw new Error('You have to content inside the <pageslide>');
                }

                content = angular.element(slider.children);

                /* Append */
                body.appendChild(slider);

                /* Slider Style setup */
                slider.style['z-index'] = param.zIndex;
                slider.style.position = param.container !== false ? 'absolute' : 'fixed';
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.overflow = 'hidden';
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.transitionProperty = 'width, height';

                if (param.squeeze) {
                    body.style.position = 'absolute';
                    body.style.transitionDuration = param.speed + 's';
                    body.style.webkitTransitionDuration = param.speed + 's';
                    body.style.transitionProperty = 'top, bottom, left, right';
                }

                function setBodyPosition(position) {
                    body.style.top = position.top || body.style.top;
                    body.style.right = position.right || body.style.right;
                    body.style.bottom = position.bottom || body.style.bottom;
                    body.style.left = position.left || body.style.left;
                }

                function setSliderPosition(position) {
                    slider.style.top = position.top || slider.style.top;
                    slider.style.right = position.right || slider.style.right;
                    slider.style.bottom = position.bottom || slider.style.bottom;
                    slider.style.left = position.left || slider.style.left;
                }

                function setSliderDimension(dimension) {
                    slider.style.width = dimension.width || slider.style.width;
                    slider.style.height = dimension.height || slider.style.height;
                }

                switch (param.side) {
                    case 'right':
                        setSliderDimension({height: attrs.psCustomHeight || '100%'});
                        setSliderPosition({
                          top: attrs.psCustomTop || '0px',
                          right: attrs.psCustomRight || '0px',
                          bottom: attrs.psCustomBottom || '0px'
                        });
                        break;
                    case 'left':
                        setSliderDimension({height: attrs.psCustomHeight || '100%'});
                        setSliderPosition({
                          top: attrs.psCustomTop || '0px',
                          bottom: attrs.psCustomBottom || '0px',
                          left: attrs.psCustomLeft || '0px'
                        });
                        break;
                    case 'top':
                        setSliderDimension({width: attrs.psCustomWidth || '100%'});
                        setSliderPosition({
                          top: attrs.psCustomTop || '0px',
                          right: attrs.psCustomRight || '0px',
                          left: attrs.psCustomLeft || '0px'
                        });
                        break;
                    case 'bottom':
                        setSliderDimension({width: attrs.psCustomWidth || '100%'});
                        setSliderPosition({
                          right: attrs.psCustomRight || '0px',
                          left: attrs.psCustomLeft || '0px',
                          bottom: attrs.psCustomBottom || '0px',
                        });
                        break;
                }


                /* Closed */
                function psClose(slider, param) {
                    if (slider && slider.style.width !== 0) {
                        if (param.cloak) {
                          content.css('display', 'none');
                        }
                        switch (param.side) {
                            case 'right':
                                setSliderDimension({width: '0px'});
                                if (param.squeeze) {
                                    setSliderPosition({right: '0px'});
                                }
                                if (param.push) {
                                    setSliderPosition({right: '0px', left: '0px'});
                                }
                                break;
                            case 'left':
                                setSliderDimension({width: '0px'});
                                if (param.squeeze) {
                                    setSliderPosition({left: '0px'});
                                }
                                if (param.push) {
                                    setSliderPosition({right: '0px', left: '0px'});
                                }
                                break;
                            case 'top':
                                setSliderDimension({height: '0px'});
                                if (param.squeeze) {
                                    setSliderPosition({top: '0px'});
                                }
                                if (param.push) {
                                    setSliderPosition({top: '0px', bottom: '0px'});
                                }
                                break;
                            case 'bottom':
                                setSliderDimension({height: '0px'});
                                if (param.squeeze) {
                                    setSliderPosition({bottom: '0px'});
                                }
                                if (param.push) {
                                    setSliderPosition({top: '0px', bottom: '0px'});
                                }
                                break;
                        }
                    }
                    $scope.psOpen = false;

                    if (param.keyListener) {
                        $document.off('keydown', keyListener);
                    }

                    setBodyClass('closed');
                }

                /* Open */
                function psOpen(slider, param) {
                    if (slider.style.width !== 0) {
                        switch (param.side) {
                            case 'right':
                                setSliderDimension({width: param.size});
                                if (param.squeeze) {
                                    setBodyPosition({right: param.size});
                                }
                                if (param.push) {
                                    setBodyPosition({right: param.size, left: '-' + param.size});
                                }
                                break;
                            case 'left':
                                setSliderDimension({width: param.size});
                                if (param.squeeze) {
                                    setBodyPosition({left: param.size});
                                }
                                if (param.push) {
                                    setBodyPosition({right: '-' + param.size, left: param.size});
                                }
                                break;
                            case 'top':
                                setSliderDimension({height: param.size});
                                if (param.squeeze) {
                                    setBodyPosition({top: param.size});
                                }
                                if (param.push) {
                                    setBodyPosition({top: param.size, bottom: '-' + param.size});
                                }
                                break;
                            case 'bottom':
                                setSliderDimension({height: param.size});
                                if (param.squeeze) {
                                    setBodyPosition({bottom: param.size});
                                }
                                if (param.push) {
                                    setBodyPosition({top: '-' + param.size, bottom: param.size});
                                }
                                break;
                        }
                        setTimeout(function() {
                            if (param.cloak) {
                                content.css('display', 'block');
                            }
                        }, (param.speed * 1000));

                        if (param.keyListener) {
                            $document.on('keydown', keyListener);
                        }

                        setBodyClass('open');
                    }
                }

                function isFunction(functionToCheck) {
                    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
                }

                /**
                * close the sidebar if the 'esc' key is pressed
                */
                function keyListener(e) {
                    var ESC_KEY = 27;
                    var key = e.keyCode || e.which;

                    if (key === ESC_KEY) {
                        psClose(slider, param);
                    }
                }

                /*
                * Watchers
                * */

                $scope.$watch('psOpen', function(value) {
                    if (!!value) {
                        // Open
                        psOpen(slider, param);
                    } else {
                        // Close
                        psClose(slider, param);
                    }
                });

                $scope.$watch('psSize', function(newValue, oldValue) {
                    if (oldValue !== newValue) {
                        // when the psSize attribute is changed, resize the pageslide
                        param.size = newValue;
                        psOpen(slider, param);
                    }
                });


                /*
                * Events
                * */

                $scope.$on('$destroy', function () {
                    body.removeChild(slider);
                });

                if ($scope.psAutoClose) {
                    $scope.$on('$locationChangeStart', function() {
                        psClose(slider, param);
                    });
                    $scope.$on('$stateChangeStart', function() {
                        psClose(slider, param);
                    });

                }
            }
        };
    }
]);
