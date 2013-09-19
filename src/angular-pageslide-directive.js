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
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* parameters */
                var param = {};
                param.side = attrs.pageslide || 'right';
                param.speed = attrs.psSpeed || '0.5';
                param.size = '300px';

                /* DOM manipulation */
                var content = document.getElementById(attrs.href.substr(1));
                var slider = document.createElement('div');
                //console.log(content);
                slider.id = "ng-pageslide";

                /* Style */
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.zIndex = 1000;
                slider.style.position = 'fixed';
                slider.style.transitionProperty = 'width, height';

                slider.style.width = 0;
                slider.style.height = 0;
                switch (param.side){
                    case 'right':
                        slider.style.height = '100%'; 
                        slider.style.top = '0px';
                        slider.style.bottom = '0px';
                        slider.style.right = '0px';
                        break;
                    case 'left':
                        slider.style.height = '100%';   
                        slider.style.top = '0px';
                        slider.style.bottom = '0px';
                        slider.style.left = '0px';
                        break;
                    case 'top':
                        slider.style.width = '100%';   
                        slider.style.left = '0px';
                        slider.style.top = '0px';
                        slider.style.right = '0px';
                        break;
                    case 'bottom':
                        slider.style.width = '100%'; 
                        slider.style.bottom = '0px';
                        slider.style.left = '0px';
                        slider.style.right = '0px';
                        break;
                }


                /* Append */
                document.body.appendChild(slider);
                slider.appendChild(content);

                //console.log('Pageslider Done.');

                /*
                * Events
                * */
                el[0].addEventListener('click',function(e){
                    //console.log(0);
                    e.preventDefault();
                    var shown = slider.style.width != 0 && slider.style.width != 0;
                    if (shown){
                        //content.style.display = 'none';
                        //slider.className = slider.className.replace(' ps-hidden','');
                        //slider.className += ' ps-shown';
                        //console.log('show');
                        switch (param.side){
                            case 'right':
                                slider.style.width = param.size; 
                                break;
                            case 'left':
                                slider.style.width = param.size; 
                                break;
                            case 'top':
                                slider.style.height = param.size; 
                                break;
                            case 'bottom':
                                slider.style.height = param.size; 
                                break;
                        }
                        setTimeout(function(){
                            content.style.display = 'block';
                        },(param.speed * 1000));

                    }

                });

                var close_handler = document.getElementById(attrs.href.substr(1) + '-close');
                if (close_handler){
                    close_handler.addEventListener('click', function(e){
                        console.log('er');
                        e.preventDefault();
                        if (slider.style.width != 0 && slider.style.width != 0){
                            content.style.display = 'none';
                            //slider.className = slider.className.replace(' ps-shown','');
                            //slider.className += ' ps-hidden';
                            switch (param.side){
                                case 'right':
                                    slider.style.width = '0px'; 
                                    break;
                                case 'left':
                                    slider.style.width =  '0px'; 
                                    break;
                                case 'top':
                                    slider.style.height =  '0px'; 
                                    break;
                                case 'bottom':
                                    slider.style.height =  '0px'; 
                                    break;
                            }
                        }
                    });
                };


            }
        };

    }]);
