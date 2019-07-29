function createMatrixCE() {

    function MatrixConsole(elmt) {
        that = this;
        this.elmt = elmt;
        this.selector = $(elmt);
        that.linesToDisplay = [];

        // get and define lines
        $(this.selector).find(".matrix-text").each(function () {
            // define
            let lineType = {
                type: ($(this).attr("matrix-type") ? $(this).attr("matrix-type") : "normal"),
                config: {
                    firstDelay: ($(this).attr("matrix-firstDelay") ? $(this).attr("matrix-firstDelay") : 1200),
                    afterLineDelay: ($(this).attr("matrix-afterLineDelay") ? $(this).attr("matrix-afterLineDelay") : 400),
                    typingDelay: ($(this).attr("matrix-typingDelay") ? $(this).attr("matrix-typingDelay") : 40),
                    additionalClasses: ($(this).attr("matrix-additionalClasses") ? $(this).attr("matrix-additionalClasses") : ""),
                    textprefix: ($(this).attr("matrix-textprefix") ? $(this).attr("matrix-textprefix") + "# " : ""),
                },
                text: $(this).html()
            }
            that.linesToDisplay.push(lineType);
        });

    }

    MatrixConsole.prototype.appendTypeWriterItem = function (...args) {
        let that = this;
        switch (args.length) {
            case 0:
                this.selector.append(
                    "<span class='typewriter-item " + that.config.additionalClasses + "'>" +
                    "<span class='prefix'>" + that.config.textprefix + "</span><span class='matrix-linetext'></span>" +
                    "</span>"
                );
                break;
            case 1:
                this.selector.append(
                    "<span class='typewriter-item " + that.config.additionalClasses + "' data-text='" + args[0] + "'>" +
                    "<span class='prefix'>" + that.config.textprefix + "</span><span class='matrix-linetext'></span>" +
                    "</span>"
                );
                break;
            default:
                break;
        }

    };

    MatrixConsole.prototype.typeIt = function (selector, text, n) {
        var that = this;
        let timeOut = (Math.random() * 0.25 * that.config.typingDelay) + that.config.typingDelay * 0.75;

        if (n < (text.length)) {
            $(that.elmt + ' ' + selector + ' span.matrix-linetext').html(text.substring(0, n + 1));
            n++;
            setTimeout(function () {
                    that.typeIt(selector, text, n, that.config);
                },
                timeOut
            );
        } else {
            $.event.trigger(that.elmt + ":linedisplayed");
        }

    };


    MatrixConsole.prototype.start = function () {
        var that = this;
        var i = 0;
        let text = "";
        that.config = [];
        let messageType = "";

        /**
         * refreshes the data:
         * text
         * type of linecode
         * config (delaytimes)
         */
        function refresh() {
            text = that.linesToDisplay[i].text;
            messageType = that.linesToDisplay[i].type;
            that.config = that.linesToDisplay[i].config;
        }

        refresh();

        that.appendTypeWriterItem(text);

        if (messageType === "instant") {
            $(that.elmt + ' span.typewriter-item').html(text);
        } else {
            setTimeout(function () {
                that.typeIt('span.typewriter-item', text, 0);
            }, that.config.afterLineDelay);
        }

        $(window).on(that.elmt + ":linedisplayed", function () {
            i++;
            if (i < text.length) {
                refresh();
                that.appendTypeWriterItem(text);


                let timeOut = (((Math.random() * 0.25) * that.config.firstDelay) + that.config.firstDelay * 0.75);
                setTimeout(function () {
                        if (messageType === "instant") {
                            $(that.elmt + ' span.typewriter-item:last-child').html(text);
                            $.event.trigger(that.elmt + ":linedisplayed");
                        } else {
                            that.typeIt('span.typewriter-item:last-child', text, 0, that.config);
                        }
                    },
                    timeOut
                )

            } else {
                that.appendTypeWriterItem();
            }

            // scroll to bottom
            $(that.selector).scrollTop($(that.selector)[0].scrollHeight);

            if (i === text.length) {
                $.event.trigger(that.elmt + ":finished");
            }
        });
    };

    $(".matrix").each(function (index, data) {
        let id = "#" + $(this).attr("id");
        let element = document.querySelector(id);
        let matrixConsole = new MatrixConsole(id);

        let touchBoy = $(this).find(".touch-me-message");

        if ($(touchBoy).length) {
            $(this).on("click", function (index, data) {
                $(this).find(".touch-me-message").fadeOut("fast",
                    function () {
                        if (!$(this).hasClass("clicked")) {
                            $(this).addClass("clicked");
                            matrixConsole.start();
                        }
                    });
            })
        } else {
            isUserInView(element, matrixConsole, "start")
        }
    });


    function isUserInView(queryObject, object, objectFunction) {
        // The checker
        const gambitGalleryIsInView = el => {
            const scroll = window.scrollY || window.pageYOffset
            const boundsTop = el.getBoundingClientRect().top + scroll

            const viewport = {
                top: scroll,
                bottom: scroll + window.innerHeight,
            }

            const bounds = {
                top: boundsTop,
                bottom: boundsTop + el.clientHeight,
            }

            return (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom)
                || (bounds.top <= viewport.bottom && bounds.top >= viewport.top);
        }


        // requestAnimationFrame
        const raf =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60)
            }


        const handler = () => raf(() => {
            const element = queryObject;
            if (gambitGalleryIsInView(element)) {
                if (!$(element).hasClass("clicked")) {
                    $(element).addClass("clicked");
                    object[objectFunction]();
                }
            }
        })

        handler()
        window.addEventListener('scroll', handler)

    }
}


$(document).ready(function () {
    createMatrixCE();
})