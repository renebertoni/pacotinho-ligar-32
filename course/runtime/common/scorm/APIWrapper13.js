/*******************************************************************************
**
** FileName: APIWrapper.js
**
*******************************************************************************/

/*******************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee does
** not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
** OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
** This file is part of the ADL Sample API Implementation intended to provide
** an elementary example of the concepts presented in the ADL Sharable
** Content Object Reference Model (SCORM).
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API implementation within the window
** hierarchy and (2) to validate that the data being exchanged via the
** API conforms to the defined CMI data types.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are several other possible implementations.
**
** Usage: Executable course content can call the API Wrapper
**      functions as follows:
**
**    javascript:
**          var result = doLMSInitialize();
**          if (result != true) 
**          {
**             // handle error
**          }
**
**    authorware
**          result := ReadURL("javascript:doLMSInitialize()", 100)
**
*******************************************************************************/

var _Debug = false;  // set this to false to turn debugging off
                     // and get rid of those annoying alert boxes.
var _LogDebug = getParam(null,'debug',false);
var _ShowErrors = false;  // set this to false to turn debugging off
var _FindCheckOpener = false;
var _FindCheckFrames = true;
var _lmsInitialized = false;

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101;
var _ServerBusy = 102;
var _InvalidArgumentError = 201;
var _ElementCannotHaveChildren = 202;
var _ElementIsNotAnArray = 203;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var _InvalidSetValue = 402;
var _ElementIsReadOnly = 403;
var _ElementIsWriteOnly = 404;
var _IncorrectDataType = 405;

// local variable definitions
var apiHandle = null;

function logDebug( msg ) {
	if (_LogDebug)
		jLog( "APIWrapper: "+msg );
}
function exmsg(ex) {
	var msg = ex.message;
	if (msg===null || typeof(msg)=="undefined")
		msg = ex.description;
	return msg;
}

/*******************************************************************************
**
** Function: doLMSInitialize()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitialize()
{
	if (_lmsInitialized)
		return true;
	
	try {
		var api = getAPIHandle();
		if (api==null)
			return false;
		if (_Debug)
			logDebug("Initialize() with api "+api+" Initialize typeof "+typeof(api.Initialize));
		var result = api.Initialize("");
   		if (_Debug)
	    	logDebug("Initialize() returns "+result);
		_lmsInitialized = true;

	   //if (result.toString() != "true")
	   if (result!=true)
	   {
	      var err = ErrorHandler("Initialize()");
	   }

	   //return result.toString();
	   return result;
	} catch(e) {
		logDebug("LMSInitialize() catch exception "+exmsg(e)+"; "+e);
		apiHandle = null;
	}
	return "false";
}

/*******************************************************************************
**
** Function doLMSFinish()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinish()
{
	var api = getAPIHandle();
	if (api==null)
		return false;
	// call the Terminate function that should be implemented by the API
	if (_Debug)
		logDebug("Terminate()");
	var result = api.Terminate("");
	if (result!=true) {
		var err = ErrorHandler("Terminate()");
	}
   return result;
}

/*******************************************************************************
**
** Function doLMSGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**             element (e.g. cmi.core.student_id)
** Return:  The value presently assigned by the LMS to the cmi data model
**       element defined by the element or category identified by the name
**       input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
*******************************************************************************/
function doLMSGetValue(name)
{
	var api = getAPIHandle();
	if (api==null)
		return false;
	if (_Debug)
		logDebug("GetValue("+name+")");
	var value = api.GetValue(name);
	var errCode = api.GetLastError();
	if (errCode != _NoError) {
		// an error was encountered so display the error description
		ErrorHandler("GetValue("+name+")",true);
		return "";
	} else {
		//return value.toString();
		return value;
	}
}

/*******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
*******************************************************************************/
function doLMSSetValue(name, value)
{
	var api = getAPIHandle();
	if (api==null)
		return false;
	if (_Debug)
		logDebug("SetValue('"+name+"','"+value+"')");
	var result = api.SetValue(name, value);
	//if (result.toString() != "true")
	if (result != true) {
		ErrorHandler("SetValue('"+name+"','"+value+"')",true);
	}
	return;
}

/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function 
**
*******************************************************************************/
function doLMSCommit()
{
	var api = getAPIHandle();
	if (api==null)
		return false;
	var result = api.Commit("");
	if (result != "true") {
		ErrorHandler("Commit()");
	}
	return result;
}

/*******************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function 
**
*******************************************************************************/
function doLMSGetLastError()
{
	var api = getAPIHandle();
	if (api==null)
		return false;
   return api.GetLastError();
}

/*******************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Call the LMSGetErrorString function 
**
********************************************************************************/
function doLMSGetErrorString(errorCode)
{
	var api = getAPIHandle();
	if (api==null)
		return false;
   return api.GetErrorString(errorCode);
}

/*******************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the 
**          input error code
**
** Description:
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnostic(errorCode)
{
	var api = getAPIHandle();
	if (api==null)
		return false;
   return api.GetDiagnostic(errorCode);
}

/*******************************************************************************
**
** Function LMSIsInitialized()
** Inputs:  none
** Return:  true if the LMS API is currently initialized, otherwise false
**
** Description:
** Determines if the LMS API is currently initialized or not.
**
*******************************************************************************/
function LMSIsInitialized()
{
	return _lmsInitialized;
}

/*******************************************************************************
**
** Function ErrorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is also displayed.
**
*******************************************************************************/
function ErrorHandler(ctx,forceShowErrors)
{
   if (!(forceShowErrors==true) && _ShowErrors!=true)
		return 0;

	if (typeof(ctx)=="undefined")
		ctx = "";
	else
		ctx += " failed. Error: ";

   // check for errors caused by or from the LMS
   //var errCode = api.LMSGetLastError().toString();
   var errCode = doLMSGetLastError();
   if (errCode != _NoError)
   {
      // an error was encountered so display the error description
      var errDescription = ctx+doLMSGetErrorString(errCode);

      if (_Debug == true)
      {
         errDescription += "; Diagnostic: ";
         errDescription += doLMSGetDiagnostic("");
         // by passing null to LMSGetDiagnostic, we get any available diagnostics
         // on the previous error.

      logDebug(errDescription);
   }
   }

   return errCode;
}

/******************************************************************************
**
** Function getAPIHandle()
** Inputs:  None
** Return:  value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function getAPIHandle()
{
   if (apiHandle == null)
   {
      apiHandle = getAPI();
   }

   return apiHandle;
}
function LMSCheckApiAlive()
{
	if (apiHandle!=null) {
		try {
			doLMSGetLastError(); //sprawdzenie prawidowego dziaania  
			return true;
		} catch(e) {
			logDebug("LMSCheckApiAlive error "+exmsg(e));
			apiHandle = null;
		}
   }
   return false;
}


function isUndefined(o) {
	if (o==null || typeof(o)=="undefined")
		return true;
	return false;
}

function getAttr(o,aname,opath) {
	try {
		var v = o[aname];
		return v;
	} catch(e) {
		if (isUndefined(opath))
			opath = "o";
		logDebug("exception on accessing "+opath+"."+aname+": "+exmsg(e));
      }
		return null;
}

function cacheToString(o) {
	return (o===null?"null":o.toString());
}
function cacheIn(cache,o) {
	var i;
	for(i=0; i<cache.length; i++) {
		if (cache[i]==o)
			return true;
	}
	return false;
}
function cacheAdd(cache,o) {
	cache.push(o);
}
function cacheCreate(cache,o) {
	return new Array();
}
function dumpVars(o) {
	logDebug("object "+o+" properties: ");
	for(key in o) {
		logDebug("\t"+key+": type "+typeof(o[key])+" value "+o[key]);
	}
}
function findAPI(win,wpath,walkAttr,apiAttr,searchCache) {
	if (isUndefined(wpath))
		wpath = "window";
	if (isUndefined(walkAttr))
		walkAttr = "parent";
	if (isUndefined(apiAttr))
		apiAttr = "API_1484_11";
	if (isUndefined(searchCache))
		searchCache = cacheCreate();
	var i;
	var frame;
	var framecount;
	var wlocation;
	var api;
	while(!isUndefined(win)) {
		wlocation = getAttr(win,"location",wpath);
		//if (_Debug)
			logDebug("searching api in "+wpath+"; location="+wlocation);
		if (cacheIn(searchCache,win)) {
			logDebug("window "+wpath+" was already searched. skipping...");
			return null;
		}
		cacheAdd(searchCache,win);
		// search in window
		api = getAttr(win,apiAttr,wpath);
		if (api!=null) {
			logDebug("api found in "+wpath);
			return api;
		}
		// search in frames
		try {
			framecount = getAttr(win,"length");
			if (framecount!==null && framecount>0) {
				for(i=0; i<framecount; i++) {
					frame = win.frames[i];
					fpath = wpath+".frames["+i+"]";
					api = findAPI(frame,fpath,"",apiAttr,searchCache);
					if (api!=null)
						return api;
					}
				}
		} catch(e) {
			logDebug("Exception occurs when searching in "+wpath+" frames: "+exmsg(e));
		}
		// go up in hierarchy
		oldwin = win;
		win = null;
		if (walkAttr.length>0) {
			// check opener
			win = getAttr(oldwin,"opener",wpath);
			if (win!=null && win!=oldwin && (api=findAPI(win,wpath+".opener",walkAttr,apiAttr,searchCache))!=null) {
				return api;
			}
			// check walkAttr/parent
			win = getAttr(oldwin,walkAttr,wpath);
			if (win!=null)
				win = win.self;
			if (win==oldwin) {
				logDebug("new window is the same as old ("+wpath+"=="+wpath+"."+walkAttr+")!");
							break;
			}
		}
		wpath += "."+walkAttr;
   }
	return null;
}

function getAPI()
{
	var api = null;
	try {
		if (api===null)
			api = findAPI(window,"window");
		if (api===null)
			api = findAPI(window,"window","top");
	} catch(e) {
		logDebug("getAPI error "+exmsg(e));
	}
	return api;
}


function formatScormTime(s) {
	var h = Math.floor(s/3600);
	var m = Math.floor((s-h*3600)/60);
	s = s % 60;
	var time = "PT"+h+"H"+m+"M"+s+"S";
	return time;
}
function doLMSGetMode() {
	return doLMSGetValue("cmi.mode");
}
function doLMSGetMasteryScore() {
	var mastery = ""; //doLMSGetValue("cmi.student_data.mastery_score");
	if (mastery=="")
		mastery = getParam(window.location,"mastery");
	if (mastery===null)
		mastery = "";
	return mastery;
}
function doLMSGetComments() {
	if (doLMSGetValue("cmi.comments_from_learner._count")>0)
		return doLMSGetValue("cmi.comments_from_learner.0.comment");
	return "";
}
function doLMSSetComments(v) {
	return doLMSSetValue("cmi.comments_from_learner.0.comment",v);
}
/**
 * unknown, not_attempted, incomplete, completed, failed, passed
 */
function doLMSSetStatus(v) {
	if (v=="passed" || v=="failed") {
		doLMSSetValue("cmi.success_status",v);
		doLMSSetValue("cmi.completion_status","completed");
	} else {
		doLMSSetValue("cmi.completion_status",v);
	}
}
/**
 * accepts score in format score[,max]
 */
function doLMSSetScore(v,max) {
	if (max==null || typeof(max)=="undefined" || max=="")
		max = 100;
	if (v==-1) {
		doLMSSetStatus("completed");
		doLMSSetValue("cmi.score.max","");
		doLMSSetValue("cmi.score.raw","");
	} else {
		v = 100 * v / max;
		max = 100;
		doLMSSetValue("cmi.score.max",max);
		doLMSSetValue("cmi.score.raw",v);
	}
}
function doLMSSetTime(v) {
	doLMSSetValue("cmi.session_time",v);
}
/**
 * Znaczenie cmi.exit:
 *
 * SCORM 1.2: "" (empty), "time-out", "suspend", "logout"
 *    Ustawiona warto�� ma wp�yw wy��cznie na warto�� cmi.core.entry w nast�pnej sesji u�ytkownika z danym SCO.
 *    "" - oznacza normalne zako�czenie SCO (nie ma te� �adnego wp�ywu na warto�� cmi.suspend_data w nast�pnej sesji)
 *
 * SCORM 1.3: "" (empty), "time-out", "suspend", "logout" (deprecated), "normal"
 *    Ustawiona warto�� ma wp�yw na cmi.entry oraz cmi.suspend_data w nastepnej sesji u�ytkownika z danym SCO.
 *    "" - oznacza nieokre�lon� przyczyn� zako�czenia pracy z SCO. W nast�pnej sesji warto�ci wszystkich zmiennych b�d� puste.
 *         W szczeg�lno�ci - cmi.suspend_data b�dzie pustym stringiem.
 *    "suspend" - oznacza przerwanie pracy z SCO z zamiarem powr�cenia do niej. Jest to JEDYNA warto�� cmi.exit, kt�ra
 *         spowoduje odtworzenie przez LMS warto�ci cmi.suspend_data w nast�pnej sesji!!!
 */
function doLMSSetExit() {
	doLMSSetValue("cmi.exit", "suspend");
}
