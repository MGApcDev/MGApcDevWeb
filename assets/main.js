const MGApcDev = {
    init() {
        this.navbar();
        this.twitterRemoveImages();
    },
    navbar() {
        $(function() {
            console.log( "ready!" );
            $('.navbar--left--burger').on('click', function() {
                $('.navbar--right').toggleClass('closed');
                $('.navbar--right').slideToggle(100);
            });

        });
    },
    twitterRemoveImages() {
        $(function() {
            // Twitter widget hack, remove photos from being displayed --------------------------------------
            // Modified, Credit to
            // @(https://twittercommunity.com/t/auto-expand-photos-always-on-for-embedded-timeline/62510/28)
            $('.site--twitter').on('DOMSubtreeModified propertychange', "#twitter-widget-0", function () {
                console.log('Foudn');
                $(".twitter-timeline").contents().find(".timeline-Tweet-media").css("display", "none");
                $(".twitter-block").css("height", "100%");
            });
        });
    }
}
MGApcDev.init();
