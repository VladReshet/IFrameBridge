// bridge for cross-domains messages between iframe and parent page
var IFrameBridge = function(send){
    var routes = {};
    var debug = false;
    
    var log = function(type, text){
        if(debug){
            console[type](text);
        }
    };

    var sender = function(route, data){
        send(JSON.stringify({
            route : route,
            data : data
        }));
    };

    var handleRoute = function(event){
        var data = JSON.parse(event.data);

        var route = data.route;
        var data = data.data;

        if(routes[route] !== undefined){
            log('info', 'Route ' + route + ' was called');
            routes[route](data, sender);
        }else{
            log('error', 'Route ' + route + ' is undefined');
        }
    };

    return {
        init : function(){
            window.addEventListener('message', function(event){
                handleRoute(event);
            });

            return this;
        },

        send : sender,

        addRoute : function(route, callback){
            routes[route] = callback;

            return this;
        },

        removeRoute : function(route){
            routes[route] = undefined;
            delete routes[route];

            return this;
        },

        getRoutes : function(){
            return routes;
        },

        toggleDebug : function(){
            debug = !debug;
        }
    };
};
