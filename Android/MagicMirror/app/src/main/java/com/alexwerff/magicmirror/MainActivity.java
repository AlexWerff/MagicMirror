package com.alexwerff.magicmirror;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.support.v4.app.FragmentActivity;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends FragmentActivity {

    private WebView webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(R.layout.activity_main);
        webview = (WebView) findViewById(R.id.webView);


        webview.getSettings().setJavaScriptEnabled(true);

        final Activity activity = this;
        WebChromeClient webChromeClient = new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
                activity.setProgress(progress * 1000);
            }

        };
        webview.setWebChromeClient(webChromeClient);

        webview.setWebViewClient(new WebViewClient() {
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Toast.makeText(activity, "Oh no! " + description, Toast.LENGTH_SHORT).show();
            }
        });
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        startActivity(intent);
        /*intent.putExtra(RecognizerIntent.ACTION_RECOGNIZE_SPEECH, getClass()
                .getPackage().getName());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                GeneralConstants.TEXT_VOICE);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        startActivityForResult(intent,
                0);*/

        webview.loadUrl("http://52.58.17.93:3000");

    }

    @Override
    protected void onStart() {
        super.onStart();
    }
}
