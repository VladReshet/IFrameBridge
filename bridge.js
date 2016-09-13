// bridge for cross-domains messages between iframe and parent page
var IFrameBridge = function(send){
    var routes = {};

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
            console.info('Route ' + route + ' was called');
            routes[route](data, sender);
        }else{
            console.error('Route ' + route + ' is undefined');
        }
    };

    return {
        init : function(){
            window.addEventListener('message', function(event){
                handleRoute(event);
            });
        },

        send : sender,

        addRoute : function(route, callback){
            routes[route] = callback;
        },

        removeRoute : function(route){
            routes[route] = undefined;
            delete routes[route];
        },

        getRoutes : function(){
            return routes;
        }
    };
};
