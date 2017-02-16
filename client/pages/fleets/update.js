router.pages["fleets/update"] = {};

router.pages["fleets/update"].handler = function() {

    console.log("Loading update page...");

    var me = router.pages["fleets/update"];

    if (router.hash.length < 2) {
        router.error_message = "Can not update a non-existant fleet.";
        router.load("#error");
        return;
    }

    if (me.template === undefined) {
        $.get("templates/fleets/update_fleet.html", function(data) {
            me.template = data;
            me.handler();
        });
    } else {
        ft.page.section.body.html(me.template);
        ft.page.section.body.fadeIn();

        router.clear_buttons();

        $.get("/api/fleet/basic", { "auth": ft.ident, "fleet_id": router.hash[1] }, function(data) {
            console.log(data);
            $("#fleet-checkpoint-title-box").text(data.fleet_title);
            $("#fleet-checkpoint-fc-box").text(data.fc_name);
            var notes = $("#fleet-checkpoint-description-input");
            var members = $("#fleet-checkpoint-member-input");
            $("#submit-fleet-update-button").click(function(e) {
                if (members.val().length == 0) {
                    ft.modal.setup("Duhhhh.... Filthy??? Is that you???", "You need to add at least 1 member to the checkpoint list.<br>Click anywhere grey, or the red X to continue.");
                    ft.modal.doShow(true);
                } else {
                    var package = {};
                    package.auth = ft.ident;
                    package.members = members.val();
                    package.notes = notes.val();
                    package.fleet_id = data.fleet_id;

                    $.post("/api/fleet/update", package, function(result) {
                        console.log(result);
                        if (result.invalid) {
                            ft.modal.setup("Aww shit...", "Fleet update did NOT post. <br>Please contact Peacekeeper. Or dont. It's probably your fault.<br>Since this failed, I'm taking you back to the dashboard. <br>Click anywhere grey, or the red X to continue.");
                            ft.modal.doShow(true, () => router.load("dashboard"));
                        } else {
                            ft.modal.setup("Woot woot!", "Fleet update posted.<br>Click anywhere grey, or the red X to continue.");
                            ft.modal.doShow(true, () => router.reload());
                        }
                    });
                }
            });
        });
    }
}