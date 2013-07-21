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
            // template: '<div class="angular-leaflet-map"></div>',
            link: function ($scope, el, attrs) {
                console.log($scope);
                console.log(el);
                console.log(attrs);

                /* expose for debug */
                deb = el;
                
                /* get the content from the div */
                var content = document.getElementById(attrs.href.substr(1));
                //console.log(html);

                /* append the content in a new div and attach it to the dom */
                var slider = document.createElement('div');
                slider.id = "page-slide";
                slider.style.display = 'none';

                document.body.appendChild(slider);
                slider.appendChild(content);
                content.style.display = "block";
                setCSS();

                console.log('ok');

                /* change display on */

                /*
                * Events
                * */

                el.bind('click',function(){
                    slider.style.display = 'block';
                });

                close_handler = angular.element(attrs.href + '-close');

                close_handler.bind('click',function(){
                    console.log('hide');
                    slider.style.display = 'none';
                })

                /*
                * Init CSS properties
                * */

                function setCSS(){
                    slider.style.position = 'absolute';
                    slider.style.top = '0px';
                    slider.style.bottom = '0px';
                    slider.style.right = '0px';
                    slider.style.width = '300px';
                    slider.style.background = '#00FF00';
                }


            }
        }
    }]);
