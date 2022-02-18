# BID-FINGERS-PLUGIN
BID Karalundi SDK Cordova Plugin
	
	Este plugin provee fácil acceso al SDK Karalundi desde una aplicación Ionic usando la plataforma Android.

PREPARACIÓN DE LA APLICACIÓN.

	Antes que la aplicación pueda ser construida correctamente, la plataforma Android debe ser agregada mediante la ejecución: ionic cordova platform add Android
	desde linea de consola (CLI) mientras se ubica en el dorectorio raíz del proyecto.

INSTALACIÓN.

	Desde un proyecto existente de Ionic, ejecutar: ionic cordova plugin add plugins_src/cordova-plugin-fingers-bid-master 
	(donde "plugins_src/cordova-plugin-fingers-bid-master" corresponde al directorio fuente del plugin).

INICIALIZACIÓN DE SDK.

	Se debe primero inicilizar el SDK con el archivo de licencia ("com.teknei.bid2019-01-24.lic") de la apliación antes de poder realizar el enrolamiento 
	mediante el uso del SDK. El archivo de licencia sera proporcionado por BID; dicho archivo, debera ser colocado en: 
			directorio_plugin/platforms/android/app/src/main/assets
	
ENROLAMIENTO DE USUARIO.

	Con el propósito de facilitar el enrolamiento, el plugin se encuentra diseñado para realizar el enrolamiento automaticamente una vez ejecutada la correcta 
	inicicializacíon del plugin.

var FingersBidEnrollment: any;
var userID ="A unique user id";


FingersBidEnrollment.initialize(userID, onSuccess, onError);

        
IMPLEMENTACIÓN.

	Se recomienda evaluar la carga y estado de la plataforma antes de realizar el llamado al plugin, así como, la verificación de la variable de acceso al plugin.
		
startFingersEnrollment(){
    this.platform.ready().then(() => {
      if (typeof FingersBidEnrollment !== 'undefined') {
		FingersBidEnrollment.initialize(userID, onSuccess, onError);
	  }
        else {
          alert("BID plugin not available.");
        }
    });
  }
  
	El manejo del éxito o falla del enrolamiento puede ser manejado a tráves de funciones typescript, mismas que son recibidas como parámetro en la implementación
	del plugin.
 
 CONSIDERACIONES ESPECIALES.
 	
	El dispositivo debe encontrarse conectado a Internet.
	El dispositivo debe proporcionar los siguientes permisos para el correcto funcionamiento del plugin, mismos que deben ser solicitados por la aplicación:
		    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
			<uses-permission android:name="android.permission.CAMERA" />
			<uses-permission android:name="android.permission.FLASHLIGHT" />
	Realizar la modificación en archivo config.xml del directorio "directorio_plugin/config.xml",con el propósito de actualizar el valor minimo del SDK de 
	Android	requerido para la correcta ejecicion del plugin(Valor mínimo = 21):
			<preference name="android-minSdkVersion" value="21" />
	Actualizar archivo build.gradle del directorio: "directorio_plugin/platforms/android", con el propósito de actualizar el valor minimo del SDK de Android 
	requerido para la correcta ejecicion del plugin(Valor mínimo = 21):
			defaultMinSdkVersion=21
	Realizar adaptación del tag "widget" en su parámetro id para asignar el valor: "com.teknei.bid" del archivo config.xml del directorio:
	"directorio_plugin/config.xml".
 
