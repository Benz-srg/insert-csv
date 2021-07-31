
$(document).ready(function () {
    switch (window.location.pathname) {
        case '/admin/dashboard': $("#nav-dashboard").addClass("active"); break;
        case '/admin/user': $("#nav-user").addClass("active"); break;
        case '/admin/chat': $("#nav-chat").addClass("active"); break;
        case '/admin/bank': $("#nav-bank").addClass("active"); break;
        case '/admin/market': $("#nav-market").addClass("active"); break;
        case '/admin/number': $("#nav-number").addClass("active"); break;
        case '/admin/deposit-list': $("#nav-deposit-list").addClass("active");break;
        case '/admin/deposit-history': $("#nav-deposit-history").addClass("active"); break;
        case '/admin/withdraw-list': $("#nav-withdraw-list").addClass("active"); break;
        case '/admin/withdraw-history': $("#nav-withdraw-history").addClass("active"); break;
        case '/admin/history-statistics': $("#nav-history-statistics").addClass("active"); break;
        case '/admin/history-play': $("#nav-history-play").addClass("active"); break;
        case '/admin/history-win': $("#nav-history-win").addClass("active"); break;
        case '/admin/option-game': $("#nav-option-game").addClass("active"); break;
        case '/admin/option-banner': $("#nav-option-banner").addClass("active"); break;
        case '/admin/option-theam': $("#nav-option-theam").addClass("active"); break;
        case "/user/home": $("#nav-home").addClass("active"); break;
        case "/user/lottery": $("#nav-lottery").addClass("active"); break;
        case "/user/list": $("#nav-list").addClass("active"); break;
        case "/user/award": $("#nav-award").addClass("active"); break;
        case "/user/transactions": $("#nav-transactions").addClass("active"); break;
        case "/user/info": $("#nav-info").addClass("active"); break;
        case "/user/contact": $("#nav-contact").addClass("active"); break;
    }
});
