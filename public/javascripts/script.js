$(function (){
    $('.subtitle .auth').hide();
    $('#error_nick, #error_pass').hide();
    $('.client .say').hide();
    $('.game').hide();
    $('.modal').hide();
    $('#test').hide();

    var name = $.cookie('name');
    var value = $.cookie('value');

    if (name && value) {
        try {
            var request = new XMLHttpRequest();
            var req = "nick="+$.cookie('name')+"&prize="+$.cookie('value');
            request.open("POST", '/prize_test', true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.addEventListener("readystatechange", function () {
                if (request.responseText) {
                    $('.surprise-nick').text(name);
                    $('.surprise').text(value)
                    $('.modal').show();
                }
            });
            console.log(req);
            request.send(req);
        } catch (e) {
            console.error(e);
        }
    }

    if (name){
        $('#auth').hide();
        $('.client .say').show();
        $('.client .say span').text(name);
        $('.surprise-nick').text(name);
        $('#start').show();
        $('.scroll_wrapper').scrollTop(0);
    }

    $('#auth').on('click', function (){
        $('.subtitle .auth').show();
        $('.subtitle .content').hide();
        $('#auth').hide();
        $('.scroll_wrapper').scrollTop(screen.height)
    });
    function rand(len) {
        return Math.floor(Math.random() * (len - 0 + 1)) + 0;
    }
    var loot = ["10.000.000$", "Mercedes G65", "Квартира 2х комнатная", "2.000.000$", "Toyota Chaiser"]
    var clone = loot.sort(() => Math.random() - 0.5)
    for (i = 0; i < 5; i++){
        var sel = '.v'+ (i).toString()
        $(sel).text(clone[i])
    }
    for (i = 0; i < 3; i++) {
        $(".game .list li").clone().appendTo(".game .list");
    }

    $('#start').on('click', function (){
        if (name) {
            $('.game').show();
            $('.window').css({
                right: "0"
            })
            $('.list li').css({
                border: '4px solid #ED7638'
            })
            function selfRandom(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var x = selfRandom(50, 100);
            $('.list li:eq('+x+')').css({
                border:'4px solid #BF2A27'
            })
            var text = $('.list li:eq('+x+') span').text()

            $('.surprise').text(text);

            $.cookie('value', text);

            try {
                var request = new XMLHttpRequest();
                var req = "nick="+$.cookie('name')+"&prize="+text;
                request.open("POST", '/prize', true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.addEventListener("readystatechange", function () {
                    if (request.responseText) {
                        /***/
                        $('.window').animate({
                            right: (x-1)*130
                        }, 10000);

                        setTimeout(function (){
                            location.reload();
                        }, 12500)
                    }
                });
                console.log(req);
                request.send(req);
            } catch (e) {
                console.error(e);
            }
        } else {
            $('#msg').text('Для начала игры необходимо авторизоваться!').css({ color: '#ED7638' })
        }
    });

    $('#login').on('click', function (){
        $('#error_nick, #error_pass').hide();
        var nick = $('#nick').val().toString().trim();
        var pass = $('#pass').val().toString().trim();
        var server = $('#select .item[data-active="1"]').text().toString().trim();
        if (!nick) $('#error_nick').show();
        if (!pass) $('#error_pass').show();
        if(nick && pass) {
            if(nick && pass) {
                try {
                    var request = new XMLHttpRequest();
                    var req = "nick="+nick+"&password="+pass+"&server="+server;
                    request.open("POST", '/login', true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    request.addEventListener("readystatechange", function () {
                        if (request.responseText) {
                            var response = JSON.parse(request.responseText);
                            console.log(response)
                            if (response.success) {
                                /* Good */
                                $('#test').hide();
                                $.cookie('name', nick);
                                console.log(response)
                                if (response.prize) {
                                    $.cookie('value', response.prize);
                                }
                                setTimeout(function (){
                                    location.reload();
                                }, 351);
                            } else {
                                $('#test').show();
                            }
                        }
                    });
                    console.log(req);
                    request.send(req);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    });

    $('.field .item').on('click', function (){
        if ($('#select').hasClass('active')) {
            $('.item[data-active="1"]').get(0).dataset.active = "0"
            $(this).get(0).dataset.active = "1"
            $('#select').removeClass('active')
        } else {
            $('#select').addClass('active')
        }
    });

    for (var i = 0; i < 3; i++) {
        $(".list li").clone().appendTo(".list");
    }
});