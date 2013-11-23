#!/usr/bin/perl
use warnings;
use Net::WebSocket::Server;
use Data::Dumper;
use strict;
use utf8;
use JSON qw ( from_json to_json);
use Imager::QRCode;

my $server = Net::WebSocket::Server->new(
    listen => 8080,
    on_connect => sub {
        my ($serv, $conn) = @_;
        $conn->on(
            handshake => sub {
                my ($conn, $handshake) = @_;
            },
            utf8 => \&got_message,
        );
    },
);
$server->start;

sub got_message {
    my ($conn, $msg) = @_;
    warn $msg;
    my $m = from_json( $msg );
    if ($m->{action} eq 'give_me_token') {
        give_token($conn, $m->{ip});
    }
    if ($m->{action} eq 'trying_to_connect') {
        try_to_connect($conn, $m->{data}->{token});
    }
    if ($m->{action} eq 'message') {
        just_send_message($conn, $m->{data});
    }
    if ($m->{action} eq 'close') {
        close_connection($conn);
    }
}

sub give_token {
    my ($conn, $ip) = @_;
    my $rand = int(rand((10e15)-1));
    my $token = sprintf "%016d", $rand;
    $conn->{token} = $token;
    $conn->{type} = 'slave';
    $conn->{server}->{connections}->{$token}->{slave} = $conn;
    my $qrcode = Imager::QRCode->new(
        size          => 4,
        margin        => 2,
        version       => 2,
        level         => 'L',
        casesensitive => 1,
        lightcolor    => Imager::Color->new(255, 255, 255),
        darkcolor     => Imager::Color->new(0, 0, 0),
    );
    my $img = $qrcode->plot("http://$ip/master.html?t=$token");
    $img->write(file => "images/$token.bmp");
    $conn->send_utf8("<img src='http://$ip/images/$token.bmp'></img>$token");
}

sub try_to_connect {
    my ($conn, $token) = @_;
    if ( defined($conn->{server}->{connections}->{$token})
            && !defined($conn->{server}->{connections}->{$token}->{master}) ) {
        $conn->send_utf8('OK');
        $conn->{type} = 'master';
        $conn->{server}->{connections}->{$token}->{master} = $conn;
        $conn->{partner} = $conn->{server}->{connections}->{$token}->{slave};
        $conn->{server}->{connections}->{$token}->{slave}->{partner} = $conn;
        $conn->{server}->{connections}->{$token}->{slave}->send_utf8('Partner_connected');
        print "connected1\n 
        : $conn->{server}->{connections}->{$token}->{slave} \n :
          $conn->{server}->{connections}->{$token}->{master} \n
          : $conn->{partner}\n";

    } else {
        print "not connected\n";
        $conn->send_utf8('Такого токена не существует');
    }
}

sub just_send_message {
    my ($conn, $message) = @_;
    my $text = to_json({
        action => 'message',
        data => $message
    });
    $conn->{partner}->send_utf8($text);
}

sub close_connection {
    my ($conn) = @_;
#    print Dumper $conn;
    $conn->disconnect(1000, 777);
    $conn->{partner}->disconnect(1000, 777);
}