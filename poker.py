# -*- coding:utf-8 -*-
#    author    :   丁雪峰
#    time      :   2019-08-22 11:54:00
#    email     :   fengidri@yeah.net
#    version   :   1.0.1

import random
import json

class g:
    status = 0
    level_n = None
    level_c = None
    color = None

def send(peer, tp, msg, clear = False):
    msg['type'] = tp
    msg['status'] = peer.status
    msg['level_n'] = g.level_n
    msg['level_c'] = g.level_c

    if clear:
        msg['clear'] = True

    peer.ws.write_message(json.dumps(msg))

class Peer(object):
    def __init__(self):
        self.ID = 0
        self.ws = None
        self.status = 0

    def init(self):
        self.pokers = []
        self.draft = []


peers = [Peer(), Peer(), Peer(), Peer()]
peers[0].ID = 0
peers[1].ID = 1
peers[2].ID = 2
peers[3].ID = 3


def gen_pokers():
    a = []
    for i in range(1, 14):
        a.append('R%d' % i)
        a.append('B%d' % i)
        a.append('S%d' % i)
        a.append('P%d' % i)

    for i in range(1, 14):
        a.append('R%d' % i)
        a.append('B%d' % i)
        a.append('S%d' % i)
        a.append('P%d' % i)

    a.append('J19')
    a.append('J20')
    a.append('J19')
    a.append('J20')
    return a

def shuffle():
    p = gen_pokers()
    random.shuffle(p)

    for peer in peers:
        peer.init()

    while p:
        i = p.pop()
        peers[0].pokers.append(i)

        i = p.pop()
        peers[1].pokers.append(i)

        i = p.pop()
        peers[2].pokers.append(i)

        i = p.pop()
        peers[3].pokers.append(i)


def turn_done():
    if peers[0].draft and \
        peers[1].draft and \
        peers[2].draft and \
        peers[3].draft:
            return True
    else:
        return False

def peer_next(peer):
    i = peers.index(peer)

    i += 1
    if i == 4:
        i = 0

    return peers[i]



def post(peer, msg):
    flag_clear = turn_done()
    if flag_clear:
        for p in peers:
            p.draft = []


    peer.draft = msg['data']

    if turn_done():
        for p in peers:
            p.status = 0
    else:
        for p in peers:
            p.status = None
        peer_next(peer).status = 0
        peer.status = 1

    for d in peer.draft:
        peer.pokers.remove(d)

    for p in peers:
        if p == peer:
            continue

        if not p.ws:
            continue

        off =  peer.ID - p.ID

        if off < 0:
            off = off + 4

        msg = {}
        msg['type'] = 'peer_post'
        msg['list_post%d' % off] = peer.draft

        send(p, "peer_post",  msg, clear = flag_clear)


    send(peer, "post_ack",  {}, clear = flag_clear)




def init(peer, msg):
    num = msg['data'][0][1:]
    num = int(num)
    g.status = 1
    g.level_n = num

    shuffle()

    for p in peers:
        if p.ws:
            sync(p)

def sync(peer):
    if g.status == 0:
        send(peer, "init",  {})
        return


    msg = {}
    msg['list_mine'] = peer.pokers
    msg['list_post0'] = peer.draft

    send(peer, "sync",  msg, clear = True)

    for p in peers:
        if p == peer:
            continue

        off =  p.ID - peer.ID

        if off < 0:
            off = off + 4

        msg['list_post%d' % off] = p.draft

    peer.ws.write_message(json.dumps(msg))














