package com.miteksystems;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.util.Log;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;
import android.util.Base64;

import com.miteksystems.facialcapture.science.api.params.FacialCaptureApi;
import com.miteksystems.facialcapture.workflow.FacialCaptureWorkflowActivity;
import com.miteksystems.facialcapture.workflow.params.FacialCaptureWorkflowParameters;
import com.miteksystems.misnap.params.CameraApi;
import com.miteksystems.misnap.params.MiSnapApi;
import com.miteksystems.misnap.utils.Utils;

import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;

/**
 * This class echoes a string called from JavaScript.
 */
public class FacialBidMitek extends CordovaPlugin {

    private CallbackContext pendingCallbackContext = null;

    // private static int mUxWorkflow;
    // private static int mGeoRegion;

    private static final String TAG = FacialBidMitek.class.getSimpleName();
    private static final long PREVENT_DOUBLE_CLICK_TIME_MS = 1000;
    private long mTime;

    //protected static final String LICENSE_KEY = "{\"signature\":\"qnluwptgoqUBKofOJgZcPA4\\/KtEsOlvHyh9IW4kGPAzAlMcRMNc1dB3\\/qT3QfMb+pz+Gl\\/U9jQ93R\\/oNGXVGRB48XAa9l1byLhu8FvfazdSkO7yFIXtPRI6+m4rnyJIqUjgnhawjwBKECvTRRuiNwesC2xLrw0+ADiJWnk8RZWLWzj5nY\\/ua9o3NiMnCISYOhHy8J9W8O\\/83qdaKxmUnANPnFwlyTnd1HOlDWWmg86aPArj2AHn9ckNCUQF6WD9Y7gRsXXQW+NTHcwPyCzwZDApX92GDc4mj\\/fwoV42W1PzpUMx7n8dEukP2mZATCtwBCVJ7Tbc6H\\/R2JF5pkd\\/ytQ==\",\"organization\":\"Daon\",\"signed\":{\"features\":[\"ALL\"],\"expiry\":\"2020-08-08 00:00:00\",\"applicationIdentifier\":\"*facialbidmitek.*\"},\"version\":\"2.1\"}";

    protected static final String LICENSE_KEY = "{\"signature\":\"qnluwptgoqUBKofOJgZcPA4\\/KtEsOlvHyh9IW4kGPAzAlMcRMNc1dB3\\/qT3QfMb+pz+Gl\\/U9jQ93R\\/oNGXVGRB48XAa9l1byLhu8FvfazdSkO7yFIXtPRI6+m4rnyJIqUjgnhawjwBKECvTRRuiNwesC2xLrw0+ADiJWnk8RZWLWzj5nY\\/ua9o3NiMnCISYOhHy8J9W8O\\/83qdaKxmUnANPnFwlyTnd1HOlDWWmg86aPArj2AHn9ckNCUQF6WD9Y7gRsXXQW+NTHcwPyCzwZDApX92GDc4mj\\/fwoV42W1PzpUMx7n8dEukP2mZATCtwBCVJ7Tbc6H\\/R2JF5pkd\\/ytQ==\",\"organization\":\"xxxxxx\",\"signed\":{\"features\":[\"ALL\"],\"expiry\":\"2019-08-08 00:00:00\",\"applicationIdentifier\":\"com.miteksystems.*\"},\"version\":\"2.1\"}";
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("coolMethod")) {
            Toast.makeText(cordova.getContext(), "Intentando Inicializar el metodo start desde execute", Toast.LENGTH_SHORT).show();
            String message = args.getString(0);
            this.coolMethod(message, callbackContext);
            return true;
        }
        return false;
    }
 // CallbackContext
    private void coolMethod(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            // callbackContext.success(message);
            // Toast.makeText(cordova.getContext(), "Intentando Inicializar el Complemento Facial", Toast.LENGTH_SHORT).show();
            this.startFacialCaptureWorkflow(callbackContext);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private void startFacialCaptureWorkflow(CallbackContext callback) {
        this.pendingCallbackContext = callback;
        // Prevent multiple MiSnap instances by preventing multiple button presses
        if (System.currentTimeMillis() - mTime < PREVENT_DOUBLE_CLICK_TIME_MS) {
            // Double-press detected
            return;
        }
        mTime = System.currentTimeMillis();

        // Add in parameter info for MiSnap
        com.miteksystems.ParameterOverrides overrides = new com.miteksystems.ParameterOverrides(cordova.getContext());
        Map<String, Integer> paramMap = overrides.load();
        JSONObject jjs = new JSONObject();
        try {
            // MiSnap-specific parameters
            jjs.put(CameraApi.MiSnapAllowScreenshots, 1);

            // Add FacialCapture-specific parameters from the Settings Activity, stored in shared preferences
            // NOTE: If you do not set these, the optimized defaults for this SDK version will be used.
            // NOTE: Do not set these unless you are purposefully overriding the defaults!
            for (Map.Entry<String, Integer> param : paramMap.entrySet()) {
                jjs.put(param.getKey(), param.getValue());
            }
            jjs.put(FacialCaptureApi.FacialCaptureLicenseKey, LICENSE_KEY);
            jjs.put(FacialCaptureApi.BlinkThreshold, 1);
            jjs.put(FacialCaptureApi.CaptureEyesOpen, 1);
            jjs.put(FacialCaptureApi.LightingMinThreshold, 500);
            jjs.put(FacialCaptureApi.SharpnessMinThreshold, 500);
            jjs.put(FacialCaptureApi.EyeMaxDistance, 360);
            jjs.put(FacialCaptureApi.EyeMinDistance, 200);
            jjs.put(CameraApi.MiSnapUseFrontCamera, 1);
            jjs.put(CameraApi.MiSnapAllowScreenshots, 1);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JSONObject jjsWorkflow = new JSONObject();
        try {
            // Optionally add in customizable runtime settings for the FacialCapture workflow.
            // NOTE: These don't go into the JOB_SETTINGS because they are for your app, not for core FacialCapture.
            jjsWorkflow.put(FacialCaptureWorkflowParameters.FACIALCAPTURE_WORKFLOW_MESSAGE_DELAY, 900);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Intent intentFacialCapture = new Intent(this.cordova.getActivity(), FacialCaptureWorkflowActivity.class);
        intentFacialCapture.putExtra(MiSnapApi.JOB_SETTINGS, jjs.toString());
        intentFacialCapture.putExtra(FacialCaptureWorkflowParameters.EXTRA_WORKFLOW_PARAMETERS, jjsWorkflow.toString());

        this.cordova.startActivityForResult(this, intentFacialCapture, MiSnapApi.RESULT_PICTURE_CODE);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (MiSnapApi.RESULT_PICTURE_CODE == requestCode) {
            if (RESULT_OK == resultCode) {
                if (data != null) {
                    byte[] image = data.getByteArrayExtra(MiSnapApi.RESULT_PICTURE_DATA);
                    String base = Base64.encodeToString(image, Base64.DEFAULT);
                    Log.e("intentFacialCapture", base);
                    this.pendingCallbackContext.success(base);
                } else {
                    this.pendingCallbackContext.error("Error onActivityResult");
                    Toast.makeText(this.cordova.getContext(), "MiSnap canceled", Toast.LENGTH_SHORT).show();
                }
            } else if (RESULT_CANCELED == resultCode) {
                Toast.makeText(this.cordova.getContext(), "MiSnap aborted", Toast.LENGTH_SHORT).show();
            }
        }
    }

}

