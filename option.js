

function ws_recv(d)
{
    g.mode = null

    if (d.clear)
    {
        g.list_post0 = []
        g.list_post1 = []
        g.list_post2 = []
        g.list_post3 = []
        show_poker(g.pokers_show0, g.list_post0)
        show_poker(g.pokers_show1, g.list_post1)
        show_poker(g.pokers_show2, g.list_post2)
        show_poker(g.pokers_show3, g.list_post3)
    }

    if (undefined != d.status)
    {
        update_status(d.status)
    }


    if (d.type == 'init')
    {
        g.list_mine = ['R1', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13']

        g.list_post0 = []
        g.list_post1 = []
        g.list_post2 = []
        g.list_post3 = []
        g.draft = []

        show_poker(g.pokers_mine,  g.list_mine)
        show_poker(g.pokers_show0, g.list_post0)
        show_poker(g.pokers_show1, g.list_post1)
        show_poker(g.pokers_show2, g.list_post2)
        show_poker(g.pokers_show3, g.list_post3)

        msg_show("请选择当前级别: ");

        g.mode = 'init'

        g.layer.draw()
        return;
    }

    if (d.type == 'sync')
    {
        g.list_mine = d.list_mine
        g.list_post0 = d.list_post0
        g.list_post1 = d.list_post1
        g.list_post2 = d.list_post2
        g.list_post3 = d.list_post3
        g.draft = []

        show_poker(g.pokers_mine,  g.list_mine)
        show_poker(g.pokers_show0, g.list_post0)
        show_poker(g.pokers_show1, g.list_post1)
        show_poker(g.pokers_show2, g.list_post2)
        show_poker(g.pokers_show3, g.list_post3)

        g.layer.draw()

        return;
    }

    if (d.type == 'peer_post')
    {

        if (d.list_post1)
        {
            g.list_post1 = d.list_post1
            show_poker(g.pokers_show1, g.list_post1)
        }
        if (d.list_post2)
        {
            g.list_post2 = d.list_post2
            show_poker(g.pokers_show2, g.list_post2)
        }
        if (d.list_post3)
        {
            g.list_post3 = d.list_post3
            show_poker(g.pokers_show3, g.list_post3)
        }

        update_status(d.status)
        g.layer.draw()

        return;
    }

    if (d.type == 'post_ack')
    {
        var v, i
        for (i in g.draft)
        {
            v = g.draft[i]
            list_remove(g.list_mine, v)
        }

        g.list_post0 = g.draft
        g.draft = []

        show_poker(g.pokers_mine, g.list_mine)
        show_poker(g.pokers_show0, g.list_post0)

        update_status(d.status)

        g.layer.draw()
        return;
    }
}


function ws_init()
{
    g.ws = new WebSocket("ws://192.168.56.2:8000/ws/" + g.id);

    g.ws.onopen = function(evt) {
        msg_show("连接成功.");
    };

    g.ws.onmessage = function(evt) {
        console.log( "Received Message: " + evt.data);

        var d = JSON.parse(evt.data)
        ws_recv(d)
    };

    g.ws.onclose = function(evt) {
        msg_show("连接断开.");
        ws_init()
    };
}

function option_post()
{
    var msg = {}
    if (g.mode == 'init')
    {
        msg.type = 'init'
    }
    else{
        msg.type = 'post'
    }
    msg.data = g.draft

    g.ws.send(JSON.stringify(msg))

    console.log(g.draft)
}


function update_status(s)
{
    g.status = s

    if (0 == g.status)
    {
        g.button.show()
        g.button._text.text("出牌")
    }
    if (1 == g.status)
    {
        g.button._text.text("收回")
    }
    if (2 == g.status)
    {
        g.button._text.text("扣牌")
    }
    if (null == g.status)
    {
        g.button.hide()
        // TODO
    }
    g.layer.draw()

}
