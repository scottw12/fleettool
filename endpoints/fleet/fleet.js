module.exports.boot_fleets = function(server) {
    server.post('/api/fleet/add/', require('./addFleet.js').addFleet);
    server.get('ap/fleet/recent', require('./viewFleets.js').getRecentFleets);
}