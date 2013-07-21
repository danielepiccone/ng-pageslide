var pageslideDirective = angular.module("pageslide-directive", []);

pageslideDirective.directive('pageslide', [
    '$http', '$log', '$parse', '$rootScope', function ($http, $log, $parse, $rootScope) {

        var defaults = {};
        var str_inspect_hint = 'Add testing="testing" to inspect this object';

        /* Return directive definition object */

        return {
            restrict: "A",
            replace: false,
            transclude: false,
            scope: {},
            link: function ($scope, el, attrs) {
                console.log($scope);
                console.log(el);
                console.log(attrs);

                /* parameters */
                var param = {};
                param.side = attrs.pageslide || 'right';
                param.speed = attrs.psSpeed || '0.5';

                /* init */
                var css_class = 'ng-pageslider ps-hidden';
                css_class += ' ps-' + param.side;

                /* expose for debug */
                //deb = el;
                
                /* DOM manipulation */
                var content = document.getElementById(attrs.href.substr(1));
                var slider = document.createElement('div');
                slider.id = "page-slide";
                slider.className = css_class;
                
                document.body.appendChild(slider);
                slider.appendChild(content);
                content.style.display = "block";
                
                console.log('Pageslider done');
                
                /* set CSS from parameters */
                if (param.speed){
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                }

                /*
                * Events
                * */

                el.bind('click',function(){
                    if (/ps-hidden/.exec(slider.className)){
                        slider.className = slider.className.replace(' ps-hidden','');
                        slider.className += ' ps-shown';
                        console.log(slider.className);
                        console.log('show');
                    }

                });

                var close_handler = angular.element(attrs.href + '-close');

                close_handler.bind('click',function(){
                    if (/ps-shown/.exec(slider.className)){
                        slider.className = slider.className.replace(' ps-shown','');
                        slider.className += ' ps-hidden';
                        console.log('hide');
                    }
                });
            }
        };

    }]);
