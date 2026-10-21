/**
 * opossumフォーム iframe の高さ補正
 *
 * opossum側は「iframe読み込み後 1.5秒・1.8秒の2回だけ」高さを postMessage で通知する。
 *  - 回線やキャッシュの状況によっては、中身の描画前に測って 90px など極端に小さい値を送ってくる
 *  - 通知を取りこぼすと高さが決まらないまま（PC: 800px固定 / SP: 初期の小さな高さ）になる
 *  - 画面幅が変わっても（回転・リサイズ）高さは再通知されない
 * ため、次の点を補う。
 *  1) 高さが「未設定」または「小さすぎる(MIN_HEIGHT未満)」なら、iframeを再読み込みして再取得（最大 MAX_RETRY 回）
 *  2) 画面幅が変わったとき、入力前であれば再読み込みして再取得
 *  いずれも、iframe内で操作が始まっている場合は入力内容を消さないよう何もしない。
 */
(function () {
    var ORIGIN = 'https://opossum.jp';
    var MIN_HEIGHT = 400;    // フォームとして有り得ない小ささの基準(px)
    var MAX_RETRY = 3;       // 取得失敗時の再読み込み回数の上限
    var CHECK_MS = 5000;     // 通知が来ない場合に、高さを確認するまでの待ち時間
    var BAD_DELAY_MS = 400;  // 小さすぎる通知を受けてから再読み込みするまでの待ち時間
    var DEBOUNCE_MS = 500;   // リサイズ後に待つ時間
    var touched = false;     // iframe内で操作が始まったか
    var retries = 0;
    var lastWidth = window.innerWidth;
    var resizeTimer = null;
    var checkTimer = null;

    function frame() {
        return document.querySelector('iframe.opossum_iframe');
    }

    function currentHeight(f) {
        return parseInt(f && f.style && f.style.height, 10) || 0;
    }

    function isBad(f) {
        return currentHeight(f) < MIN_HEIGHT;
    }

    function reload(f) {
        // 同じURLを再設定して再読み込み（opossum側が高さを再通知する）
        f.src = f.src;
        scheduleCheck();
    }

    // 高さが未設定/小さすぎれば再取得
    function recover() {
        var f = frame();
        if (!f || touched || retries >= MAX_RETRY || !isBad(f)) { return; }
        retries++;
        reload(f);
    }

    function scheduleCheck(ms) {
        clearTimeout(checkTimer);
        checkTimer = setTimeout(recover, ms || CHECK_MS);
    }

    // iframe内で操作が始まったか（フォーカスがiframeに移ると window の blur が起きる）
    window.addEventListener('blur', function () {
        var f = frame();
        if (f && document.activeElement === f) { touched = true; }
    });

    // opossumからの高さ通知を監視（小さすぎる値が来たら、すぐ再取得して待ち時間を短縮）
    window.addEventListener('message', function (e) {
        if (e.origin !== ORIGIN || typeof e.data !== 'string') { return; }
        var parts = e.data.split('\t');
        var h = parseInt(parts[0], 10);
        if (parts[1] === '3' && h > 0 && h < MIN_HEIGHT) { scheduleCheck(BAD_DELAY_MS); }
    });

    window.addEventListener('load', function () { scheduleCheck(); });

    // 画面幅の変更に追従（高さだけの変化＝スマホのアドレスバー開閉は無視）
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var w = window.innerWidth;
            if (w === lastWidth) { return; }
            lastWidth = w;
            var f = frame();
            if (f && !touched) { reload(f); }
        }, DEBOUNCE_MS);
    });
})();
