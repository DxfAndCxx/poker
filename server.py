# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2019-08-22 13:48:30
#    email     :   fengidri@yeah.net
#    version   :   1.0.1


import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.httpserver

import json

import poker

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self, name):
        if name.isdigit():
            ID = int(name)
            if ID >= 0 and ID <= 3:
                self.peer = poker.peers[ID]
                if  self.peer.ws:
                    return

                self.peer.ws = self

                poker.sync(self.peer)


    def on_message(self, message):
        msg = json.loads(message)

        if msg['type'] == 'post':
            poker.post(self.peer, msg)

        if msg['type'] == 'init':
            poker.init(self.peer, msg)

    def on_close(self):
        self.peer.ws = None

    def check_origin(self, origin):
        return True




class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/ws/(.*)', WebSocketHandler)
        ]

        settings = { "template_path": "."}
        tornado.web.Application.__init__(self, handlers, **settings)



ws_app = Application()
server = tornado.httpserver.HTTPServer(ws_app)
server.listen(8000)
tornado.ioloop.IOLoop.instance().start()
