function msg_show(msg)
{
    g.msg.text(msg)
    g.layer.draw()
}


function convert_to_num(a)
{
    var n = a.substr(1) * 1
    var c = a.substr(0, 1)

    if ('J' == c)
    {
        return n + 200
    }

    if (g.level.num == n)
    {
        n = 150;
    }

    if (2 == n) n = 100;

    if (1 == n) n = 14;

    if (g.level.color == c)
    {
        return n + 80;
    }

    if ('R' == c)
    {
        return n + 60
    }
    if ('B' == c)
    {
        return n + 40
    }
    if ('S' == c)
    {
        return n + 20
    }
    return n
}


function sort_func(a, b)
{
    return convert_to_num(b) - convert_to_num(a)
}

function list_remove(l, v)
{
    var i = l.indexOf(v)
    if (-1 == i) return
    l.splice(i, 1)
}

function mk_one_poker(x, y, v)
{
    var num = v.substr(1) * 1
    var color = v.substr(0, 1)
    var show
    var fill = 'black'

    show = num;
    if (1  == num) show = 'A';
    if (11 == num) show = 'J';
    if (12 == num) show = 'Q';
    if (13 == num) show = 'K';
    if ('R' == color) {
        color = "♥";
        fill = 'red';
    }
    if ('B' == color) {
        color = "♠";
        fill = 'black';
    }
    if ('S' == color) {
        color = "♦ ";
        fill = 'red';
    }
    if ('P' == color) color = "♣";

    if ('J' == color)
    {
        show = "$";
        color = ''
        if (19 == num)
            fill = 'grey'
        else{
            fill = 'red'
        }
    }

    var poker = new Konva.Group({ x: x, y: y, listening: true, });

    var rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: g.item_width,
        height: g.item_height,
        fill: 'white',
        cornerRadius: 10,
        stroke: 'black',
        strokeWidth: 1,
    });
    poker.add(rect)


    var text = new Konva.Text({
        x: 0,
        y: 40,
        text: color,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill:fill
    });
    poker.add(text)

    var text = new Konva.Text({
        x: 5,
        y: 5,
        text: show,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill:fill
    });
    poker.add(text)

    poker._key = v

    return poker;
}


function mk_button(cb)
{
    var button = new Konva.Group({
        x: g.win_width - 280,
        y: g.win_height - g.item_height * 2 - 40,
        listening: true,
    });

    var rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 80,
        height: 40,
        fill: 'green',
        cornerRadius: 10,
        shadowBlur: 10,
        cornerRadius: 10
    });

    var text = new Konva.Text({
        x: 5,
        y: 5,
        text: "出牌",
        fontSize: 30,
        fontFamily: 'Calibri',
    });

    button.add(rect)
    button.add(text)
    button._text = text

    button.on('click tap', function()
        {
            cb()
        })
    return button;
}


function show_poker(group, pokers)
{
    var i, v
    var x = 0
    var num = 0
    var offset = 30

    group.destroyChildren()

    for (i in pokers)
    {
        num += 1
    }

    pokers.sort(sort_func)
    console.log(pokers)


    if (group._name == 0 || group._name == 2 || group._name == "mine")
    {
        x = offset * num / 2
        x = -x
    }
    if (group._name == 1)
    {
        x = offset * num
        x = -x - g.item_width
    }


    for (i in pokers)
    {
        v = pokers[i]

        var poker = mk_one_poker(x, 0, v)


        if (group._name == 'mine')
        {
            poker.on("click tap", function(e){
                console.log(e)

                var t = e.currentTarget

                if (t._move)
                {
                    list_remove(g.draft, t._key)
                    t._move = false
                    t.move({x: 0, y: 30});
                }
                else{
                    g.draft.push(t._key)
                    t._move = true
                    t.move({x: 0, y: -30});
                }

                g.layer.draw()
            })
        }

        x = x + offset

        group.add(poker)
    }
}




