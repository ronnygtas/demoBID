package com.bid.fbe;

import android.app.Activity;
import android.util.Base64;
import android.util.Log;
import android.util.Pair;
import android.app.AlertDialog;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;
import com.identy.IdentySdk;
import com.identy.WSQCompression;
import com.identy.encryption.FileCodecBase64;
import com.identy.enums.Finger;
import com.identy.enums.FingerDetectionMode;
import com.identy.enums.Hand;
import com.identy.enums.Template;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.Manifest;
import android.widget.Toast;
import java.util.Arrays;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Query;

public class FingersBidEnrollment extends CordovaPlugin {
    private final String classTag = "FingersBidEnrollment";
    private FingerDetectionMode[] detectionModes;
    private WSQCompression compression;
    private final ArrayList<Template> requiredtemplates = new ArrayList<>();
    private boolean enableSpoofCheck        = true;
    private boolean displayboxes            = true;
    private String mode = "demo";
    private String resultFinger = "";
    private String modoFinger = "";
    private boolean displayImages = false;
    private CallbackContext pendingCallbackContext = null;
    private String userID = "";
    private String signHand = "";
    private static final String tokenEndPoint = "http://189.203.240.163:8083";
    private static final String enrollmentEndPoint = "http://189.203.240.163:9411/bid/";
    private int timeOut = 360;
    private Integer responseStatus = 0;
    private final String grantType = "password";
    private final String USR = "user";
    private final String PSW = "password";
    private OAuthAccessToken accessToken;
    private boolean tokenSuccess = false;
    private String tokenError = "";
    private boolean enrollmentSuccess = false;
    private String enrollmentError = "";
    private Map<String,String> wsqB64StrImgs = new HashMap<>();

    /**
     * Variables to verify quality of fingers
     */
    private ArrayList<Integer> arrayNFIQ = new ArrayList<>();
    private ArrayList<String> arrayFinger = new ArrayList<>();
    private String hand;
    private JSONArray argumentos;

    /**
     * permissions request code
     */
    private final static int REQUEST_CODE_ASK_PERMISSIONS = 1;

    /**
     * Permissions that need to be explicitly requested from end user.
     */
    private static final String[] REQUIRED_SDK_PERMISSIONS = new String[] {
            Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE };

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        argumentos = args;
        if ("initializeKaralundi".equals(action)) {
            initializeKaralundi(args, callbackContext, "left");
        }else if ("initializeKaralundiVerify".equals(action)) {
            initializeKaralundiVerify(args, callbackContext);
        }else if ("enrollKaralundi".equals(action)){
            enrollKaralundi(args, callbackContext);
        }else if("initializeKaralundiVariable".equals(action)){
            initializeKaralundiVariable(args, callbackContext);
        }
        return true;
    }

    private void enrollKaralundi(JSONArray args, final CallbackContext callbackContext) throws JSONException{
        getAccessToken(args.getString(0));
        pendingCallbackContext = callbackContext;
    }

    private void initializeKaralundi(JSONArray args, final CallbackContext callbackContext, String hand) throws JSONException{
        // Check permissions
        argumentos = args;
        checkPermissions();
        modoFinger = "enrolamiento";
        userID = args.getString(0);
        compression = WSQCompression.WSQ_10_1;

        if(hand.equals("left")){
            detectionModes = new FingerDetectionMode[]{FingerDetectionMode.L4F};
        }
        if (hand.equals("right")){
            detectionModes = new FingerDetectionMode[]{FingerDetectionMode.R4F};
        }

        requiredtemplates.add(Template.WSQ);
        final Activity activity = this.cordova.getActivity();
        pendingCallbackContext = callbackContext;
        // wsqB64StrImgs = new HashMap<>();
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    IdentySdk.newInstance(activity, "com.bid.fbe2019-11-23.lic", new IdentySdk.InitializationListener<IdentySdk>() {
                        @Override
                        public void onInit(IdentySdk d) {
                            try {
                                ArrayList<Finger> qc = new ArrayList<Finger>();
                                qc.add(Finger.THUMB);
                                qc.add(Finger.INDEX);
                                qc.add(Finger.MIDDLE);
                                qc.add(Finger.RING);
                                qc.add(Finger.LITTLE);

                                d.set4FintroShow(false);
                                d.setThumbIntroShow(true);

                                d.setDisplayImages(displayImages)
                                        .setMode(mode)
                                        .setAS(enableSpoofCheck)
                                        .setDetectionMode(detectionModes)
                                        .setRequiredTemplates(requiredtemplates)
                                        .setDisplayBoxes(displayboxes)
                                        .displayResult(false)
                                        .setWSQCompression(compression)
                                        .setCalculateNFIQ(true)
                                        .qcList(qc)
                                        .capture();
                                
                                d.setAllowHandChange(false);

                            } catch (Exception e) {
                                Log.e(classTag,e.getMessage());
                                callbackContext.error("Error al inicializar SDK.");
                            }
                        }
                    },captureListener);
                } catch (Exception e) {
                    Log.e(classTag,e.getMessage());
                    callbackContext.error("Inicializacion de SDK fallida.");
                }
            }
        });
    }

    IdentySdk.IdentyResponseListener captureListener = new IdentySdk.IdentyResponseListener() {
        @Override
        public void onResponse(IdentySdk.IdentyResponse response) {

            arrayFinger.clear();
            arrayNFIQ.clear();
            hand = "";

            for (Map.Entry<Pair<Hand, Finger>, IdentySdk.FingerOutput> o : response.getPrints().entrySet()) {
                Pair<Hand, Finger> handFinger = o.getKey();
                IdentySdk.FingerOutput fingerOutput = o.getValue();
                String fingerID = handFinger.first.toString() + handFinger.second.toString();
                String base64KaralundiStr = fingerOutput.getTemplates().get(Template.WSQ);

                JSONObject fingersJ = fingerOutput.toJson();
                try{
                    arrayNFIQ.add(Integer.parseInt(fingersJ.getString("nfiq_1")));
                    arrayFinger.add(fingersJ.getString("finger"));
                    hand = fingersJ.getString("hand");
                    Log.e("Huellas", "==========>>" + fingersJ);

                } catch (Exception e) {
                    e.fillInStackTrace();
                }

                try {
                    String b64Str = Base64.encodeToString(FileCodecBase64.decode(base64KaralundiStr, Base64.DEFAULT), Base64.NO_WRAP);
                    wsqB64StrImgs.put(fingerID, b64Str);
                }catch (Exception ex){
                    Log.e(classTag,ex.getMessage());
                    pendingCallbackContext.error("Error al procesar huellas, intente nuevamente.");
                }
            }
            Log.e(classTag,"IdentySdk onResponse success");
            varifyQuality("Enroll");
        }
        @Override
        public void onErrorResponse(IdentySdk.IdentyError error) {
            Log.e(classTag,"onErrorResponse");
            pendingCallbackContext.error("No se obtuvo respuesta del SDK, inténtelo de nuevo.");
            pendingCallbackContext = null;
        }
    };

    private void initializeKaralundiVerify(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        argumentos = args;
        // Check permissions
        checkPermissions();
        modoFinger = "enrolamiento";
        userID = args.getString(0);
        signHand = args.getString(1);
        Log.e("Mano para ", "firmar::  " + signHand);
        compression = WSQCompression.WSQ_10_1;

        if(signHand.equals("left")) {
            detectionModes = new FingerDetectionMode[]{FingerDetectionMode.L4F};
        }
        if (signHand.equals("right")) {
            detectionModes = new FingerDetectionMode[]{FingerDetectionMode.R4F};
        }

        requiredtemplates.add(Template.WSQ);
        final Activity activity = this.cordova.getActivity();
        pendingCallbackContext = callbackContext;
        wsqB64StrImgs = new HashMap<>();
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    IdentySdk.newInstance(activity, "com.bid.fbe2019-11-23.lic", new IdentySdk.InitializationListener<IdentySdk>() {
                        @Override
                        public void onInit(IdentySdk d) {
                            try {
                                ArrayList<Finger> qc = new ArrayList<Finger>();
                                qc.add(Finger.THUMB);
                                qc.add(Finger.INDEX);
                                qc.add(Finger.MIDDLE);
                                qc.add(Finger.RING);
                                qc.add(Finger.LITTLE);

                                d.set4FintroShow(false);
                                d.setThumbIntroShow(false);

                                d.setDisplayImages(displayImages)
                                        .setMode(mode)
                                        .setAS(enableSpoofCheck)
                                        .setDetectionMode(detectionModes)
                                        .setRequiredTemplates(requiredtemplates)
                                        .setDisplayBoxes(displayboxes)
                                        .setWSQCompression(compression)
                                        .setCalculateNFIQ(true)
                                        .displayResult(false)
                                        .qcList(qc)
                                        .capture();

                                d.setAllowHandChange(false);

                            } catch (Exception e) {
                                Log.e(classTag,e.getMessage());
                                callbackContext.error("Error al inicializar SDK.");
                            }
                        }
                    },captureListenerSign);
                } catch (Exception e) {
                    Log.e(classTag,e.getMessage());
                    callbackContext.error("Inicializacion de SDK fallida.");
                }
            }
        });
    }

    IdentySdk.IdentyResponseListener captureListenerSign = new IdentySdk.IdentyResponseListener() {
        @Override
        public void onResponse(IdentySdk.IdentyResponse response) {

            arrayFinger.clear();
            arrayNFIQ.clear();

            for (Map.Entry<Pair<Hand, Finger>, IdentySdk.FingerOutput> o : response.getPrints().entrySet()) {
                Pair<Hand, Finger> handFinger = o.getKey();
                IdentySdk.FingerOutput fingerOutput = o.getValue();
                String fingerID = handFinger.first.toString() + handFinger.second.toString();
                String base64KaralundiStr = fingerOutput.getTemplates().get(Template.WSQ);

                JSONObject fingersJ = fingerOutput.toJson();
                Log.e("Huellas", "==========>>" + fingersJ);
                try{
                    arrayNFIQ.add(Integer.parseInt(fingersJ.getString("nfiq_1")));
                    arrayFinger.add(fingersJ.getString("finger"));

                } catch (Exception e) {
                    e.fillInStackTrace();
                }

                try {
                    String b64Str = Base64.encodeToString(FileCodecBase64.decode(base64KaralundiStr, Base64.DEFAULT), Base64.NO_WRAP);
                    wsqB64StrImgs.put(fingerID, b64Str);
                }catch (Exception ex){
                    Log.e(classTag,ex.getMessage());
                    pendingCallbackContext.error("Error al procesar huellas, intente nuevamente.");
                }
            }
            Log.e(classTag,"IdentySdk onResponse success");
            varifyQuality("Sign");
        }
        @Override
        public void onErrorResponse(IdentySdk.IdentyError error) {
            Log.e(classTag,"onErrorResponse");
            pendingCallbackContext.error("No se obtuvo respuesta del SDK, inténtelo de nuevo.");
            pendingCallbackContext = null;
        }
    };

    private void initializeKaralundiVariable(JSONArray args, final CallbackContext callbackContext) throws JSONException{
        // Check permissions
        argumentos = args;
        checkPermissions();
        modoFinger = "enrolamiento";
        compression = WSQCompression.WSQ_10_1;
        String[] configs = args.getString(0).split(",");
        List<FingerDetectionMode> aux = new ArrayList<FingerDetectionMode>();

        if(configs.length == 0){
            detectionModes = new FingerDetectionMode[]{FingerDetectionMode.L4F, FingerDetectionMode.R4F};
        }else{
            for(int i = 0; i < configs.length; i++){
                switch(configs[i]){
                    case "LEFT_LITTLE":
                        aux.add(FingerDetectionMode.LEFT_LITTLE);
                        break;
                    case "LEFT_RING":
                        aux.add(FingerDetectionMode.LEFT_RING);
                        break;
                    case "LEFT_MIDDLE":
                        aux.add(FingerDetectionMode.LEFT_MIDDLE);
                        break;
                    case "LEFT_INDEX":
                        aux.add(FingerDetectionMode.LEFT_INDEX);
                        break;
                    case "RIGHT_LITTLE":
                        aux.add(FingerDetectionMode.RIGHT_LITTLE);
                        break;
                    case "RIGHT_RING":
                        aux.add(FingerDetectionMode.RIGHT_RING);
                        break;
                    case "RIGHT_MIDDLE":
                        aux.add(FingerDetectionMode.RIGHT_MIDDLE);
                        break;
                    case "RIGHT_INDEX":
                        aux.add(FingerDetectionMode.RIGHT_INDEX);
                        break;
                    case "LEFT_THUMB":
                        aux.add(FingerDetectionMode.LEFT_THUMB);
                        break;
                    case "RIGHT_THUMB":
                        aux.add(FingerDetectionMode.RIGHT_THUMB);
                        break;
                    case "LEFT_HAND":
                        aux.add(FingerDetectionMode.L4F);
                        break;
                    case "RIGHT_HAND":
                        aux.add(FingerDetectionMode.R4F);
                        break;
                }
            }
        }

        detectionModes = new FingerDetectionMode[aux.size()];
        for(int i = 0; i < configs.length; i++){
            detectionModes[i] = aux.get(i);
        }

        requiredtemplates.add(Template.WSQ);
        final Activity activity = this.cordova.getActivity();
        pendingCallbackContext = callbackContext;
        // wsqB64StrImgs = new HashMap<>();
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    IdentySdk.newInstance(activity, "com.bid.fbe2019-11-23.lic", new IdentySdk.InitializationListener<IdentySdk>() {
                        @Override
                        public void onInit(IdentySdk d) {
                            try {
                                ArrayList<Finger> qc = new ArrayList<Finger>();
                                qc.add(Finger.THUMB);
                                qc.add(Finger.INDEX);
                                qc.add(Finger.MIDDLE);
                                qc.add(Finger.RING);
                                qc.add(Finger.LITTLE);

                                d.set4FintroShow(false);
                                d.setThumbIntroShow(true);

                                d.setDisplayImages(displayImages)
                                        .setMode(mode)
                                        .setAS(enableSpoofCheck)
                                        .setDetectionMode(detectionModes)
                                        .setRequiredTemplates(requiredtemplates)
                                        .setDisplayBoxes(displayboxes)
                                        .displayResult(false)
                                        .setWSQCompression(compression)
                                        .setCalculateNFIQ(true)
                                        .qcList(qc)
                                        .capture();

                                d.setAllowHandChange(false);

                            } catch (Exception e) {
                                Log.e(classTag,e.getMessage());
                                callbackContext.error("Error al inicializar SDK.");
                            }
                        }
                    },captureListenerVariable);
                } catch (Exception e) {
                    Log.e(classTag,e.getMessage());
                    callbackContext.error("Inicializacion de SDK fallida.");
                }
            }
        });
    }

    IdentySdk.IdentyResponseListener captureListenerVariable = new IdentySdk.IdentyResponseListener() {
        @Override
        public void onResponse(IdentySdk.IdentyResponse response) {

            arrayFinger.clear();
            arrayNFIQ.clear();

            for (Map.Entry<Pair<Hand, Finger>, IdentySdk.FingerOutput> o : response.getPrints().entrySet()) {
                Pair<Hand, Finger> handFinger = o.getKey();
                IdentySdk.FingerOutput fingerOutput = o.getValue();
                String fingerID = handFinger.first.toString() + handFinger.second.toString();
                String base64KaralundiStr = fingerOutput.getTemplates().get(Template.WSQ);

                JSONObject fingersJ = fingerOutput.toJson();
                Log.e("Huellas", "==========>>" + fingersJ);
                try{
                    arrayNFIQ.add(Integer.parseInt(fingersJ.getString("nfiq_1")));
                    arrayFinger.add(fingersJ.getString("finger"));

                } catch (Exception e) {
                    e.fillInStackTrace();
                }

                try {
                    String b64Str = Base64.encodeToString(FileCodecBase64.decode(base64KaralundiStr, Base64.DEFAULT), Base64.NO_WRAP);
                    wsqB64StrImgs.put(fingerID, b64Str);
                }catch (Exception ex){
                    Log.e(classTag,ex.getMessage());
                    pendingCallbackContext.error("Error al procesar huellas, intente nuevamente.");
                }
            }
            Log.e(classTag,"IdentySdk onResponse success");
            varifyQuality("variable");
            //getJsonString(pendingCallbackContext, wsqB64StrImgs);
        }
        @Override
        public void onErrorResponse(IdentySdk.IdentyError error) {
            Log.e(classTag,"onErrorResponse");
            pendingCallbackContext.error("No se obtuvo respuesta del SDK, inténtelo de nuevo.");
            pendingCallbackContext = null;
        }
    };

    private void varifyQuality(String modo) {
        if(modo.equals("variable")) {
            String verify = "";
            if (arrayFinger != null && arrayNFIQ != null) {

                for (int nfiq_1 = 0; nfiq_1 < arrayNFIQ.size(); nfiq_1++) {
                    int quality = arrayNFIQ.get(nfiq_1);
                    String finger = arrayFinger.get(nfiq_1);

                    Log.e("calidad", ":::::::::::::::::::::" + finger + ' ' + quality);

                    verify += String.valueOf(validateFingerQuality(quality, finger));
                }

                Log.e("Valores de calidad", ":::::::::::::::::::::" + verify);

                redirectVariable(verify);

            }
        }else if(modo == "Sign") { // posible error
            String verify = "";
            if (arrayFinger != null && arrayNFIQ != null) {

                for (int nfiq_1 = 0; nfiq_1 < arrayNFIQ.size(); nfiq_1++) {
                    int quality = arrayNFIQ.get(nfiq_1);
                    String finger = arrayFinger.get(nfiq_1);

                    Log.e("calidad", ":::::::::::::::::::::" + finger + ' ' + quality);

                    verify += String.valueOf(validateFingerQuality(quality, finger));
                }

                Log.e("Valores de calidad", ":::::::::::::::::::::" + verify);

                redirectSing(verify);

            }
        } else {
            String verify = "";
            if(arrayFinger != null && arrayNFIQ != null){

                for (int nfiq_1 = 0; nfiq_1 < arrayNFIQ.size(); nfiq_1++) {
                    int quality = arrayNFIQ.get(nfiq_1);
                    String finger = arrayFinger.get(nfiq_1);
                    Log.e("calidad", ":::::::::::::::::::::" + finger + ' ' + quality);
                    verify += String.valueOf(validateFingerQuality(quality, finger));
                }

                Log.e("Valores de calidad", ":::::::::::::::::::::" + verify);

                redirect(verify);

            }
        }

    }

    private boolean validateFingerQuality(int quality, String finger) {
        if(quality > 3 && finger.equals("index")) {
            Log.e("Falla Verificacion", "prueba");

            return false;
        }
        /*if(quality > 4 && !finger.equals("index")){
            Log.e("Falla Verificacion", "prueba");

            return false;
        }*/
        return true;
    }

    private void redirect(String verify) {
        Log.e("Verificar calidad", " por huellas: " + verify);
        Log.e("Que mano evaluamos", " ----------->> " +hand);


        if(verify.contains("false") && hand.equals("left")) {
            Log.e("calidad baja en ", "mano izquierda");

            AlertDialog.Builder builder = new AlertDialog.Builder(this.cordova.getActivity());
            builder.setTitle("Importante");
            builder.setMessage("La calidad de la huella es baja, por favor intente nuevamente");
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    callKaralundi("left");
                }});
            builder.create();
            builder.show();

            return;
        }
        if((!verify.contains("false") && hand.equals("left"))) {
            callKaralundi("right");
            return;
        }

        if ((verify.contains("false") && hand.equals("right"))) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this.cordova.getActivity());
            builder.setTitle("Importante");
            builder.setMessage("La calidad de la huella es baja, por favor intente nuevamente");
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    callKaralundi("right");
                }});
            builder.create();
            builder.show();
            return;
        }

        // Calidad correcta en ambas
        getJsonString(pendingCallbackContext, wsqB64StrImgs);

    }

    private void redirectSing(String verify) {

        if(verify.contains("false")) {
            Log.e("calidad baja en ", "par firmar");
            AlertDialog.Builder builder = new AlertDialog.Builder(this.cordova.getActivity());
            builder.setTitle("Importante");
            builder.setMessage("La calidad de la huella es baja, por favor intente nuevamente");
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    try {
                        initializeKaralundiVerify(argumentos, pendingCallbackContext);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }});
            builder.create();
            builder.show();
        } else {
            getJsonString(pendingCallbackContext, wsqB64StrImgs);
        }

    }

    private void redirectVariable(String verify) {
        getJsonString(pendingCallbackContext, wsqB64StrImgs);
        /*if(verify.contains("false")) {
            Log.e("calidad baja en ", "par firmar");
            AlertDialog.Builder builder = new AlertDialog.Builder(this.cordova.getActivity());
            builder.setTitle("Importante");
            builder.setMessage("La calidad de la huella es baja, por favor intente nuevamente");
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    try {
                        initializeKaralundiVariable(argumentos, pendingCallbackContext);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }});
            builder.create();
            builder.show();
        } else {
            getJsonString(pendingCallbackContext, wsqB64StrImgs);
        }*/

    }

    private void callKaralundi(String hand){
        try {
            initializeKaralundi(argumentos, pendingCallbackContext, hand);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*Lógica de enrolamiento en servidor biometrico*/
    private void fingersFileSend(final String bidAppToken, final String jsonfilesMap){
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    BIDEndPointServices api = new RetrofitSingleton().getInstance().build(enrollmentEndPoint, timeOut).create(BIDEndPointServices.class);

                    MultipartBody.Part jsonWsqStrs =
                            MultipartBody.Part.createFormData("json", "operationId",
                                    RequestBody.create(MediaType.parse("application/json"), jsonfilesMap));

                    Call<ResponseServicesBID> call = api.fingersEnrollment("Bearer " + bidAppToken, jsonWsqStrs);

                    Response<ResponseServicesBID> response = call.execute();
                    responseStatus = response.code();
                    Log.i("FBE-fingFileSend", "onResponse responseStatus:" + responseStatus);

                    if (response.isSuccessful()) {
                        enrollmentSuccess = true;
                        Log.i("FBE-fingFileSend", "onResponse success");
                        pendingCallbackContext.success("Enrolamiento exitoso Usuario " + userID);
                        pendingCallbackContext = null;
                    } else {
                        enrollmentError = "Falla al enrolar:" + responseStatus;
                        enrollmentSuccess = false;
                        Log.i("FBE-fingFileSend", "onResponse fail:" + responseStatus);
                    }

                    if (!enrollmentSuccess) {
                        pendingCallbackContext.error(enrollmentError);
                    }
                }catch (IOException ex){
                    Log.e("FBE-fingFileSend","Onfailure:");
                    pendingCallbackContext.error("No se logró conectar al servidor de enrolamiento, verifique conexión.");
                }
            }
        });
    }

    private void getAccessToken(final String filesMap){
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                BIDEndPointServices api = new RetrofitSingleton().getInstance().build(tokenEndPoint,timeOut).create(BIDEndPointServices.class);
                Call<OAuthAccessToken> call = api.getAccessTokenByPassword(grantType,USR, PSW);
                try{
                    Response<OAuthAccessToken> response  = call.execute();
                    if (response.isSuccessful()) {
                        accessToken = response.body();
                        String bidAppToken = accessToken.getAccessToken();
                        tokenSuccess = true;
                        if(!bidAppToken.equals("")){
                            //TODO FINGERS ENROLLMENT
                            getJsonString(bidAppToken, filesMap);
                        }else{
                            pendingCallbackContext.error("Token vacío inválido");
                        }
                        Log.i("FBE-getAccessToken:","onResponse, success:" + bidAppToken);
                    } else {
                        tokenError = "Fallo al obtener token de autenticación.";
                        tokenSuccess = false;
                        Log.i("FBE-getAccessToken:","onResponse fail");
                    }
                    if(!tokenSuccess){
                        pendingCallbackContext.error(tokenError);
                    }
                }catch (IOException ex){
                    Log.e("FBE-getAccessToken:","onFailure");
                    pendingCallbackContext.error("No se logró conectar al servidor de autenticación, verifique conexión.");
                }
            }
        });
    }

    private void getJsonString(String bidAppToken, String filesMap){

        fingersFileSend(bidAppToken, filesMap);
    }

    private void getJsonString(CallbackContext callbackContext, Map<String,String> filesMap){
        if (userID.equals(""))
            userID = "" + System.currentTimeMillis();

        // detectionModes
        Log.i(classTag,"detectionModes:" + detectionModes.toString());
        //if (userID.equals(""))

        Log.i(classTag,"userID:" + userID);

        if (modoFinger == "enrolamiento") {
            JSONObject jsonWsqStrs = new JSONObject();
            try {
                jsonWsqStrs.put("operationId", userID);
                for(Map.Entry<String,String> entry: filesMap.entrySet()){
                    Log.i(classTag,"FingerKey:" + entry.getKey());
                    Log.i(classTag,"FingerValue:" + entry.getValue());
                    jsonWsqStrs.put(entry.getKey(),entry.getValue());
                }
            } catch (JSONException e) {
                Log.e("getJsonString",e.getMessage());
            }

            callbackContext.success(jsonWsqStrs.toString());

        } else if (modoFinger == "verificar") {
            for(Map.Entry<String,String> entry: filesMap.entrySet()){
                Log.i(classTag,"FingerKey:" + entry.getKey());
                Log.i(classTag,"FingerValue:" + entry.getValue());
                resultFinger = entry.getValue();
            }

            callbackContext.success(resultFinger);

        }


    }

    private class RetrofitSingleton {
        private RetrofitSingleton instance;
        private RetrofitSingleton(){}

        public RetrofitSingleton getInstance() {
            if (instance == null)
                instance = new RetrofitSingleton();
            return instance;
        }

        private Retrofit build(String baseURL, int timeOut) {
            OkHttpClient httpClient = buildHttpClient(timeOut);

            Gson gson = new GsonBuilder()
                    .setLenient()
                    .create();

            return new Retrofit.Builder()
                    .baseUrl(baseURL)
                    .validateEagerly(true)
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .client(httpClient)
                    .build();
        }

        private OkHttpClient buildHttpClient(int timeOut) {
            return new OkHttpClient.Builder()
                    .connectTimeout(timeOut, TimeUnit.SECONDS)
                    .readTimeout   (timeOut, TimeUnit.SECONDS)
                    .writeTimeout  (timeOut, TimeUnit.SECONDS)
                    .build();
        }
    }

    private interface BIDEndPointServices {
        @Multipart
        @POST("rest/v1/enrollment/finger/enroll")
        Call<ResponseServicesBID> fingersEnrollment (@Header("Authorization") String bidToken,
                                                     @Part MultipartBody.Part jsonWsqStrs);

        @Headers({"Authorization: Basic dXNlcmFwcDpwYXNzd29yZA==",
                "Content-Type: application/x-www-form-urlencoded"})
        @POST("/uaa/oauth/token")
        Call<OAuthAccessToken> getAccessTokenByPassword(
                @Query("grant_type") String type,
                @Query("username") String username,
                @Query("password") String password
        );
    }

    private class ResponseServicesBID {

        @SerializedName("resultOK")
        private boolean resultOK;

        @SerializedName("errorMessage")
        private String errorMessage;

        public boolean isResultOK() {
            return resultOK;
        }

        public void setResultOK(boolean resultOK) {
            this.resultOK = resultOK;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }

    }

    private class OAuthAccessToken {
        /**
         * Token de acceso para realizar peticiónes a recursos protegidos
         */
        @SerializedName("access_token")
        private String accessToken;

        /**
         * Tipo de token obtenido, normalmente del tipo Bearer
         */
        @SerializedName("token_type")
        private String tokenType;

        /**
         * Tiempo de expiración del token en milisegundos
         */
        @SerializedName("expires_in")
        private Long expiresIn;

        /**
         * Permisos del usuario en el API
         */
        @SerializedName("scope")
        private String scope;

        public String getAccessToken() {
            return accessToken;
        }
        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getTokenType() {
            return tokenType;
        }

        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }

        public Long getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(Long expiresIn) {
            this.expiresIn = expiresIn;
        }

        public String getScope() {
            return scope;
        }

        public void setScope(String scope) {
            this.scope = scope;
        }
    }

    /**
     * Checks the dynamically-controlled permissions and requests missing permissions from end user.
     */
    protected void checkPermissions() {
        final List<String> missingPermissions = new ArrayList<String>();
        // check all required dynamic permissions
        for (final String permission : REQUIRED_SDK_PERMISSIONS) {
            final int result = ContextCompat.checkSelfPermission(this.cordova.getActivity().getApplicationContext(), permission);
            if (result != PackageManager.PERMISSION_GRANTED) {
                missingPermissions.add(permission);
            }
        }
        if (!missingPermissions.isEmpty()) {
            // request all missing permissions
            final String[] permissions = missingPermissions
                    .toArray(new String[missingPermissions.size()]);
            ActivityCompat.requestPermissions(this.cordova.getActivity(), permissions, REQUEST_CODE_ASK_PERMISSIONS);
        } else {
            final int[] grantResults = new int[REQUIRED_SDK_PERMISSIONS.length];
            Arrays.fill(grantResults, PackageManager.PERMISSION_GRANTED);
            onRequestPermissionsResult(REQUEST_CODE_ASK_PERMISSIONS, REQUIRED_SDK_PERMISSIONS,
                    grantResults);
        }
    }


    public void onRequestPermissionsResult(int requestCode, @NonNull String permissions[],
                                           @NonNull int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_ASK_PERMISSIONS:
                for (int index = permissions.length - 1; index >= 0; --index) {
                    if (grantResults[index] != PackageManager.PERMISSION_GRANTED) {
                        // exit the app if one permission is not granted
                        Toast.makeText(this.cordova.getActivity(), "Required permission '" + permissions[index]
                                + "' not granted, exiting", Toast.LENGTH_LONG).show();
                        this.cordova.getActivity().finish();
                        return;
                    }
                }
                // all permissions were granted
                //initialize();
                //this.cordova.getActivity().
                break;
        }
    }
}