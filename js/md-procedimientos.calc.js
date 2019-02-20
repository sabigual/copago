
// Listado de procedimientos de hospitalizacion
var procsHabit = [2479,2480,2481,2482];	
var maxHost = 1200;			// Cobertura maxima al 100%

// proc: 		Codigo de procedimiento
// precio: 		Costo de procedimiento
// cant: 		Cantidad de procedimientos otorgados
// cmv: 		Cuota moderadora variable
// cmf: 		Cuota moderadora Fija
// topePDSS: 	Tope de cobertura del PDSS
// topeAltCostGradualPDSS: 			Tope Alto Costo Segun Gradualidad
// consumidoAltCostPDSS: 			Total consumido alto costo
// topeAltCostGradualPlan:		Total Alto Costo Plan Segun Carencia 
// consumidoAltCostPlan:		Total Consumido Alto Costo Plan
// topeSalariosMin: 			Tope 2 Salarios minimos
// copagoConsumidoEventoPre: 	Total Copago Consumido Segun Evento de la PreAutorizacion
// tipoAutorizacion:			Tipo de Autorizacion
// grupo: 						Grupo al que pertenece el procedimiento


function calcularCopago(argCodigoProcedimiento, argPrecio, argCantidad, argCMV, argCMF, argTopePDSS, argPCTipoCobertura, argPCCM, argPCTope, argtopeAltCostGradualPDSS, argconsumidoAltCostPDSS, argtopeAltCostGradualPlan, argconsumidoAltCostPlan, argTopeSalariosMin, argCopagoConsumidoEventoPre, argTipoAutorizacion, argGrupo, argHTCopago, argHTCentro, argHTPlanes, argHTPdss)
{
	var isValid = true;			// Validador
	var response = { 
			procedimiento: 	argCodigoProcedimiento,
			precio: 		argPrecio,
			cantidad: 		argCantidad,
			cuota_v: 		argCMV,
			cuota_f: 		argCMF,			
			tope: 			argTopePDSS,
			topeAltCostGradualPDSS: 	argtopeAltCostGradualPDSS,
			consumidoAltCostPDSS: 		argconsumidoAltCostPDSS,			
			topeAltCostGradualPlan:		argtopeAltCostGradualPlan,
			consumidoAltCostPlan:		argconsumidoAltCostPlan,						
			topeSalariosMin: 			argTopeSalariosMin,
			copagoConsumidoEventoPre: 	argCopagoConsumidoEventoPre,
			tipoAutorizacion: 			argTipoAutorizacion,
			grupo:		argGrupo,		// Grupo del Procedimiento
			HTCopago: argHTCopago, 		// Total Copago de la Autorizacion Actual
			HTCentro: argHTCentro,		// Total de lo que se le pagara al centro en la Aut Actual
			HTPlanes: argHTPlanes,		// Total de lo que cubre el plan el la autorizacion Actual
			HTPdss:   argHTPdss,		// Total de lo que cubre el PDSS en la autorizacion Actual	
			total: 		0.00, 			// El costo de total del procedimiento (precio * cantidad)
			copago: 	0.00,			// Monto pagado por el afiliado
			planes: 	0.00,			// Monto pagado por planes complementario
			pdss:		0.00,			// Monto pagado por el plan PDSS
			centro: 	0.00,			// Monto que recibe en centro de Senasa (PDSS + Complementario)			
			tipoProc: 	"",
			errorCod: 	0,
			errorMsg: 	""
		};						// Objeto JSon que retorna la funcion



    /* // dd
    alert('argCodigoProcedimiento: ' + argCodigoProcedimiento + ' | \n'
    + 'argPrecio: ' + argPrecio + ' | \n'
    + 'argCantidad: ' + argCantidad + ' | \n'
    + 'argCMV: ' + argCMV + ' | \n'
    + 'argCMF: ' + argCMF + ' | \n'
    + 'argTopePDSS: ' + argTopePDSS + ' | \n'
    + 'argPCTipoCobertura: ' + argPCTipoCobertura + ' | \n'
    + 'argPCCM: ' + argPCCM + ' | \n'
    + 'argPCTope: ' + argPCTope + ' | \n'
    + 'argGrupo: ' + argGrupo + ' | \n'		
    + 'topeAltCostGradualPDSS: ' + argtopeAltCostGradualPDSS + ' | \n'
    + 'consumidoAltCostPDSS: ' + argconsumidoAltCostPDSS + ' | \n'
    + 'topeSalariosMin: ' + argTopeSalariosMin + ' | \n'
    + 'copagoConsumidoEventoPre: ' + argCopagoConsumidoEventoPre + ' | \n'				
    + 'tipoAutorizacion: ' + argTipoAutorizacion);	
    */


	var ctCosto = parseFloat(argPrecio);
	var ctCMV = parseFloat(argCMV);
	var ctCMF = parseFloat(argCMF);
	var ctTope = parseFloat(argTopePDSS);
	var ctCantidad = parseFloat(argCantidad);
	var ctPCCM = parseFloat(argPCCM);
	var grupo = parseInt(argGrupo, 10);
	var HTCopago = parseFloat(argHTCopago); 		// Total Copago de la Autorizacion Actual 
	var HTCentro= parseFloat(argHTCentro); 			// Total de lo que se le pagara al centro en la Aut Actual
	var HTPlanes = parseFloat(argHTPlanes);
	var HTPdss =  parseFloat(argHTPdss);
	var topeAltCostGradualPDSS = parseFloat(argtopeAltCostGradualPDSS);
	var consumidoAltCostPDSS = parseFloat(argconsumidoAltCostPDSS);	
	var topeAltCostGradualPlan = parseFloat(argtopeAltCostGradualPlan);
	var consumidoAltCostPlan = parseFloat(argconsumidoAltCostPlan);		
	var topeSalariosMin = parseFloat(argTopeSalariosMin);	
	var copagoConsumidoEventoPre = 	parseFloat(argCopagoConsumidoEventoPre);	
	var tipoAutorizacion = 	parseInt(argTipoAutorizacion,10);	

	/* // dd
	alert('ctCosto: ' + ctCosto + ' | \n'
	+ 'ctCMV: ' + ctCMV + ' | \n'
	+ 'ctCMF: ' + ctCMF + ' | \n'
	+ 'ctTope: ' + ctTope + ' | \n'
	+ 'ctCantidad: ' + ctCantidad + ' | \n'
	+ 'ctPCCM: ' + ctPCCM);
	*/

		
	// Validar que se haya especificado procedimiento
	if (isNaN(argCodigoProcedimiento) || argCodigoProcedimiento.length == 0)
	{
		response.errorCod = 1;
		response.errorMsg = "No se ha especificado el codigo de procedimiento";
		isValid  = false;
	}
	// Validar que posea cuota moderadora variable o fija
	else if (isNaN(argCMV) && isNaN(argCMF))
	{
		response.errorCod = 2;
		response.errorMsg = "No se ha especificado cuota moderadora";
		isValid  = false;
	}
	// Validar que posea cuota moderadora variable o fija
    else if (argCMV == "" && argCMF == "")
	{
		response.errorCod = 3;
		response.errorMsg = "No se ha especificado valor para cuota moderadora";
		isValid  = false;
	} 
	// Validar que el costo del procedimiento no sea superior al valor contratado
    else if (ctTope > 0 && ctTope < ctCosto) {
		response.errorCod = 4;
		response.errorMsg = "El valor del procedimiento no puede ser mayor al valor contratado " + argTopePDSS + " < " + argPrecio; 
		isValid  = false;
	}	
	

	//*************************	
	// validaciones de alto costo, pre y planes abajo
	//*************************
	// *** Fix: otras validaciones mas abajo
	
	// Variables a ser retornadas
	var ctTotal = parseFloat(0.00);			// El costo de total del procedimiento (precio * cantidad)
	var ctCopago = parseFloat(0.00);		// Monto pagado por el afiliado
	var ctPlanes = parseFloat(0.00);		// Monto pagado por planes complementario
	var ctPDSS = parseFloat(0.00); 			// Monto pagado por el plan PDSS
	var ctCentro = parseFloat(0.00);		// Monto que recibe en centro de Senasa (PDSS + Complementario)	
	var tipoProc = "none";					// Tipo de procedimiento [normal, habitacion]
	var tipoAuth = "none";					// Tipo Autorizacion []
	
	var ctTopePC = parseFloat(argPCTope);
		
	// Si los parametros son validos, se procede a realizar el calculo
	if (isValid)
	{
		// Identificar el tipo de autorizacion a partir del procedimiento
		// si el procedimiento esta entre los identificados para hostitalizacion, el tipo de autorizacion de autorizacion sera hospitalizacion
		tipoProc = "normal";
		// de lo contrario seguria siendo normal
		
		$.each(procsHabit, function(index, value){
			if(value==argCodigoProcedimiento) { tipoProc = "habit"; }
		});
		
		var ctValorPss = parseFloat(0);
		var ctValorPC = parseFloat(0);
		var ctValorCopago = parseFloat(0);
		var ctValorCopagoPC = parseFloat(0);

		var baseValuePC = parseFloat(0);			// valor base para los procedimientos que tienen tope de cobertura
		var difCopagoPC = parseFloat(0);			// diferencia de copago que no estará siendo cubierta por planes complementarios
		
		var pcTipo = 0;

		// identificar si el afiliado posee plan complementario
		if (!isNaN(argPCTipoCobertura)) {
			if (argPCTipoCobertura ==1) { pcTipo = 1; }
			else if (argPCTipoCobertura == 2) { pcTipo = 2; }
		}
				
		
		switch(tipoProc)
		{
			// TODO: Calculo para procedimientos normales
			case "normal":
				if (ctCMF > 0) {
					ctValorCopago = ctCMF;
					ctValorPss = ctCosto - ctValorCopago;
				}  else if (ctCMV > 0){
					ctValorCopago = ctCosto * (ctCMV/100);
					ctValorPss = ctCosto - ctValorCopago;
				} else if (ctCMV == 0){
	                ctValorPss = ctCosto;
	                ctValorCopago = 0; // (ctCosto - ctValorPss)
				}      
				
				// TODO: Aplicar calculo de planes complementarios
				if (pcTipo > 0)
				{
					// si el tipo de cobertura es fija, se le resta el tope al copago
					if (pcTipo == 1) {
						// Si el copago que ha de pagar el afiliado es mayor que el monto de cobertura del 
						if (ctValorCopago > ctPCCM) {
							ctValorCopagoPC = ctValorCopago - ctPCCM;
							ctValorPC = ctPCCM;
						} else if (ctPCCM > 0) {
							ctValorCopagoPC = 0;
							ctValorPC = ctValorCopago;
						}
					}  // if (pcTipo == 1) 
					// si el tipo de cobertura es porcentual, se toma la proporcion del copago
					else if (pcTipo == 2) {
						if (ctPCCM >= 100){
							ctValorCopagoPC = 0;
							ctValorPC = ctValorCopago;
						} else if (ctPCCM > 0) {
							ctValorPC = ctValorCopago * (ctPCCM/100);
							ctValorCopagoPC = ctValorCopago - ctValorPC;
						}
					} // else if (pcTipo == 2) 
					
					
					if (ctTopePC > 0 && ctTopePC < ctValorPC){
						difCopagoPC = ctValorPC -ctTopePC;
						ctValorPC = ctTopePC;
					}
					
				}	// fin if (pcTipo > 0)

				ctTotal = ctCosto * ctCantidad;
				ctCopago = (ctValorCopago - ctValorPC) * ctCantidad;
				ctPDSS = ctValorPss * ctCantidad;
				ctCentro = (ctValorPss + ctValorPC) * ctCantidad;
				ctPlanes  = ctValorPC * ctCantidad;
				
				break; 	// case "normal":

			// TODO: Calculo para procedimientos de hospitalizacion
			case "habit":
				
				// Si la cuota moderado es fija el valor fija
				if (ctCosto < 1200){
					ctValorCopago = 0; 
					ctValorPss = ctCosto;
				} 

				else if ((ctCosto >= 1200) && (ctCosto < 1800)){
					ctValorCopago = ((ctCosto - 1200) * (10/100)); 
					ctValorPss = ctCosto - ctValorCopago;
				}      

				else if (ctCosto >= 1800){
					ctValorCopago = (ctCosto - 1740);
					ctValorPss = ctCosto - ctValorCopago;
				}
				
				
				// TODO: Aplicar calculo de planes complementarios
				if (pcTipo > 0)
				{
					// si el tipo de cobertura es fija, se le resta el tope al copago
					if (pcTipo == 1) {
						// Si el copago que ha de pagar el afiliado es mayor que el monto de cobertura del 
						if (ctValorCopago > ctPCCM) {
							ctValorCopagoPC = ctValorCopago - ctPCCM;
							ctValorPC = ctPCCM;
						} else if (ctPCCM > 0) {
							ctValorCopagoPC = 0;
							ctValorPC = ctValorCopago;
						}
					}  // if (pcTipo == 1) 
					// si el tipo de cobertura es porcentual, se toma la proporcion del copago
					else if (pcTipo == 2) {
						if (ctPCCM >= 100){
							ctValorCopagoPC = 0;
							ctValorPC = ctValorCopago;
						} else if (ctPCCM > 0) {
							ctValorPC = ctValorCopago * (ctPCCM/100);
							ctValorCopagoPC = ctValorCopago - ctValorPC;
						}
					} // else if (pcTipo == 2) 
					
					
					if (ctTopePC > 0 && ctTopePC < ctValorPC){
						difCopagoPC = ctValorPC -ctTopePC;
						ctValorPC = ctTopePC;
					}
					
				}	// fin if (pcTipo > 0)

				ctTotal = ctCosto * ctCantidad;
				ctCopago = (ctValorCopago - ctValorPC) * ctCantidad;
				ctPDSS = ctValorPss * ctCantidad;
				ctCentro = (ctValorPss + ctValorPC) * ctCantidad;
				ctPlanes  = ctValorPC * ctCantidad;
				
				
				// ctTotal = ctCosto * ctCantidad;
				// ctCopago = ctValorCopago * ctCantidad;
				// ctPDSS = ctValorPss * ctCantidad;
				// ctCentro = ctValorPss;				
				
				break; 	// case "habit":
				
			default:
				response.errorCod = 5;
				response.errorMsg = "Tipo de autorizacion no identificado";
			
				break;	// default:
		} //  switch(tipoProc)
		
	}	// if (isValid)
	
	// validaciones respecto al copago 2 salarios minimos	
	// [HTCopago] ==> Copago de la Autorizacion Actual
	// [copagoConsumidoEventoPre] ==> Copago Consumido del Evento Pre
	
	var FaltaParaTopeSalMin = topeSalariosMin-(copagoConsumidoEventoPre + HTCopago);
	
		// Si no ha llegado a consumir el tope recalcular tomando en cuenta el valor total de copago de la autorizacion actual 								
		if ((copagoConsumidoEventoPre + HTCopago + ctCopago) >= topeSalariosMin) {
			
			CopTemporal = ctCopago
			ctCopago = FaltaParaTopeSalMin
			ctCentro = ctCentro + (CopTemporal - FaltaParaTopeSalMin);
			ctPDSS = ctPDSS + (CopTemporal - FaltaParaTopeSalMin);
			faltanteCopago = CopTemporal - FaltaParaTopeSalMin;
			response.errorCod = 0;
			response.errorMsg = '7.1- <span class="color-azul">El valor del proc. Actual + el Copago Acumulado + el Copago del Evento sobrepasan el tope de salarios minimos, Exedente transferido al PDSS. </span> </br> Exedente:[RD$' + FaltaParaTopeSalMin.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']'; 
			//isValid  = true;		
		}
					
	// Validar aqui lo relativo a alto costo deL PDSS y PLANES	
    if ((tipoAutorizacion === 9) || (grupo === 9)) {
			// Dentro de esta estructura ha de haber una separacion, respecto a lo que cubre el pdss y lo que cubre planes.		
			// validar si ha llegado a consumir el total del alto costo PDSS y Planes
			// 	Cubre los valores de la autorizacion Actual.
			//*************
			var FaltaParaTopeAltoCostoPDSS = topeAltCostGradualPDSS - (consumidoAltCostPDSS + HTPdss);
			var FaltaParaTopeAltoCostoPLANES = 	topeAltCostGradualPlan - (consumidoAltCostPlan + HTPlanes);
			//*************
											
			// Si tengo disponible en Alto Costo PDSS
			if (FaltaParaTopeAltoCostoPDSS >= 0) {
				//response.errorCod = 0;
				//response.errorMsg = response.errorMsg + '</br> 9.0-  <span class="color-azul">El Afiliado no a agotado el Tope Alto Costo PDSS </span> </br> Tope Alto Costo PDSS Segun Gradualidad:[' + topeAltCostGradualPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Consumido Tope Alto Costo PDSS :[' + consumidoAltCostPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Total A Pagar Autorizacion actual :[' + HTCentro.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Disponible Para El Tope Alto Costo PDSS:[' + FaltaParaTopeAltoCostoPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']'; 				
				
				// Si el valor del procedimiento actual es mayor que lo que tengo disponible en Alto Costo
				// TODO: Aqui pasar el valor al PLAN si aplica
				if (ctPDSS>FaltaParaTopeAltoCostoPDSS){	
					var ExedenteACopago = ctPDSS - FaltaParaTopeAltoCostoPDSS;
																	
					response.errorCod = 0;
					response.errorMsg = response.errorMsg + '</br> 9.1-  <span class="color-rojo">Con este Procedimiento El Afiliado agota el Tope Alto Costo PDSS </span> </br> <span class="color-naranja"><em>Considerar Si tiene Disponible en Planes pagarlo por ahi, exedente va a copago</em></span> </br> Tope Alto Costo PDSS Segun Gradualidad:[' + topeAltCostGradualPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Consumido Tope Alto Costo PDSS :[' + consumidoAltCostPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Total A Pagar PDSS Autorizacion actual :[' + HTPdss.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Total A Pagar Procedimiento actual PDSS :[' + ctPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Disponible Para El Tope Alto Costo PDSS:[' + FaltaParaTopeAltoCostoPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Tope Alto Costo PLANES Segun Gradualidad:[' + topeAltCostGradualPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br>* Consumido Tope Alto Costo Planes :[' + consumidoAltCostPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Total A Pagar PLANES Autorizacion actual :[' + HTPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* A Pagar Procedimiento Actual Planes:[' + ctPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Disponible Alto Costo PLANES Segun Carencia:[' + FaltaParaTopeAltoCostoPLANES.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] '; 					
					
					// Si tengo disponible en planes y si el procedimiento actual esta cubierto
					if(FaltaParaTopeAltoCostoPLANES>0 && ctPlanes > 0){
					// Calcular lo que va al pdss y pasar el resto a planes si aplica, en caso de que desborde pasar exedente a copago solo la primera vez	
						
						if(ctPDSS>FaltaParaTopeAltoCostoPLANES){							
							//alert(ExedenteACopago);							

							if(ExedenteACopago>FaltaParaTopeAltoCostoPLANES){
								var CopagoTemporal = ctPlanes;
								ctPlanes = FaltaParaTopeAltoCostoPLANES;
								ctPDSS =   FaltaParaTopeAltoCostoPDSS;
								ctCentro = ctPDSS + ctPlanes;
								ctCopago = CopagoTemporal + ctCopago +(ExedenteACopago-FaltaParaTopeAltoCostoPLANES);
								
								response.errorCod = 0;
								response.errorMsg = response.errorMsg + '</br> 9.3- <span class="color-azul"><em>Tiene Disponible en Planes, exedente ha hido a copago</em></span> </br>* Tope Alto Costo PLANES Segun Gradualidad:[' + topeAltCostGradualPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br>* Consumido Tope Alto Costo Planes :[' + consumidoAltCostPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Total A Pagar PLANES Autorizacion actual :[' + HTPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* A Pagar Procedimiento Actual Planes:[' + ctPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Disponible Alto Costo PLANES Segun Carencia:[' + FaltaParaTopeAltoCostoPLANES.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> <span class="color-rojo"><em>Agotado El Alto Costo del Plan</em></span>'; 					
									
							}
							
							else if (ExedenteACopago<=FaltaParaTopeAltoCostoPLANES){
								
								ctPDSS =   FaltaParaTopeAltoCostoPDSS;
								ctPlanes = ctPlanes + ExedenteACopago;
								ctCentro = ctPDSS + ctPlanes;								
								ctCopago = ctCosto - ctCentro;							
								
								response.errorCod = 0;
								response.errorMsg = response.errorMsg + '</br> 9.4- <span class="color-azul"><em>Tiene Disponible en Planes</em></span> </br>* Tope Alto Costo PLANES Segun Gradualidad:[' + topeAltCostGradualPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br>* Consumido Tope Alto Costo Planes :[' + consumidoAltCostPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Total A Pagar PLANES Autorizacion actual :[' + HTPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* A Pagar Procedimiento Actual Planes:[' + ctPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Disponible Alto Costo PLANES Segun Carencia:[' + FaltaParaTopeAltoCostoPLANES.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] '; 					
							
							}														
						
						}

					}
					// si no cubre planes, se pasa el exedeente al tope del alto costo pdss al copago del afiliado
					else {
								// puede que cubra pdss pero no planes
							if (FaltaParaTopeAltoCostoPDSS>0){	
								ctPDSS =   FaltaParaTopeAltoCostoPDSS;
								ctCentro = ctPDSS + ctPlanes;								
								ctCopago = ctCopago + ExedenteACopago;							
								
								response.errorCod = 0;
								response.errorMsg = response.errorMsg + '</br> 9.5-  <span class="color-rojo"><em>Con este Procedimiento se ha Agotado El Alto Costo del PDSS</em></span> </br> -El Exedente ha sido transferido al Copago: [' + ExedenteACopago.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']'; 					
							}
							else
							{

								response.errorCod = 96;
								response.errorMsg = response.errorMsg + '</br> 9.6-  <span class="color-rojo"><em>No se Puede Dar Este Procedimiento Porque Esta Agotado El Alto Costo del PDSS y Planes</em></span> ';								
							}					
					}	


					
				}
				
				// Si lo que voy a pagar del procedimiento actual es menor o igual a lo que tengo disponible.
				if (ctPDSS<=FaltaParaTopeAltoCostoPDSS){
																				
					//response.errorCod = 0;
					//response.errorMsg = response.errorMsg + '</br> 9.2-  <span class="color-rojo">Con este Procedimiento El Afiliado agota el Tope Alto Costo PDSS </span> </br> <span class="color-naranja"><em>Considerar Si tiene Disponible en Planes pagarlo por ahi</em></span> </br> Tope Alto Costo PDSS Segun Gradualidad:[' + topeAltCostGradualPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Consumido Tope Alto Costo PDSS :[' + consumidoAltCostPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Total A Pagar PDSS Autorizacion actual :[' + HTPdss.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Total A Pagar Procedimiento actual PDSS :[' + ctPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Disponible Para El Tope Alto Costo PDSS:[' + FaltaParaTopeAltoCostoPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Tope Alto Costo PLANES Segun Gradualidad:[' + topeAltCostGradualPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br>* Consumido Tope Alto Costo Planes :[' + consumidoAltCostPlan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Total A Pagar PLANES Autorizacion actual :[' + HTPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* A Pagar Procedimiento Actual Planes:[' + ctPlanes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br>* Disponible Alto Costo PLANES Segun Carencia:[' + FaltaParaTopeAltoCostoPLANES.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] '; 					
					
				}
								

			}	
												
			// Si no tengo Disponible Alto Costo PDSS, pasar valor a planes si aplica
			// Observacion para planes: Cuando los dos salarios minimos hayan sido consumidos, el valor pasa a pdss o planes si aplica.
			else if (FaltaParaTopeAltoCostoPDSS < 0) {
					
				var ExedenteAutorizar = FaltaParaTopeAltoCostoPDSS - HTCentro;
				// puede haber 2 tipos de exedentes:
				// 	1- Cuando el total consumido de alto costo sobrepasa por unos centimos tope de alto costo segun gradualidad
				//	2- Cuando se esta calculando el valor actual del proximo procedimiento
				// Solo permitir la autorizacion en Alto Costo si tiene disponible en consumidoAltCostPlan
				
				response.errorCod = 92;
				response.errorMsg = response.errorMsg + '</br> 9.2- <span class="color-rojo">No se puede convertir la Autorizacion actual a Alto Costo Porque tiene un Exedente Al Tope Alto Costo PDSS </span> </br> Tope Alto Costo PDSS Segun Gradualidad:[' + topeAltCostGradualPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Consumido Tope Alto Costo PDSS :[' + consumidoAltCostPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Faltante Para El Tope Alto Costo PDSS:[' + FaltaParaTopeAltoCostoPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Total A Pagar Autorizacion actual :[' + HTCentro.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +']  </br> Exedente Autorizacion Actual:[' + ExedenteAutorizar.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']'; 
				// aqui validar cuando el afiliado haya agotado el tope de alto costo, validar el tope de alto costo planes		
			}	

										
			else if (consumidoAltCostPDSS < topeAltCostGradualPDSS) {
				
				// verificar valor procedimiento actual que no exeda el topeAltCostGradualPlan, de ser asi pasar exedente a copago
				// alert('topeAltCostGradualPDSS:'+topeAltCostGradualPDSS+'\n 1-FaltaParaTopeAltoCostoPDSS:'+FaltaParaTopeAltoCostoPDSS +' \n ctCopago:'+ctCopago+' \n ctCentro:'+ctCentro+' \n ctPDSS:'+ctPDSS);
				
				if(ctCentro > FaltaParaTopeAltoCostoPDSS){
					var RestanteApagarAlCentro = ctCentro - FaltaParaTopeAltoCostoPDSS;
					var ExedenteACopago = ctCentro - FaltaParaTopeAltoCostoPDSS;
					// El [ExedenteACopago] solo debera ser pasado a copago, si el tope Alto Costo de Plan esta a cero o a llegado a ser consumido en su totalidad.
					// Hay dos validaciones en este caso, esta y la de mas arriba cuando (FaltaParaTopeAltoCostoPDSS === 0)
					
					ctCopago = 	ctCopago + ExedenteACopago;
					ctCentro = 	FaltaParaTopeAltoCostoPDSS;
					ctPDSS = 	FaltaParaTopeAltoCostoPDSS - ctPlanes;
					response.errorCod = 0;
					response.errorMsg = response.errorMsg + '</br> 9.3- <span class="color-naranja"> Con Este Procedimiento El Afiliado a agotado el tope de alto Costo.  </span> </br> Tope Segun Gradualidad:[' + topeAltCostGradualPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Consumido Alto Costo :[' + consumidoAltCostPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ']  </br> Faltante Para El Tope:[' + FaltaParaTopeAltoCostoPDSS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '] </br> Valor a pagar al centro:['+ ctCentro.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +'] </br> Exedente Pasado a Copago:['+ ExedenteACopago.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +']'; 				
				}

				if(ctCentro < FaltaParaTopeAltoCostoPDSS){
					/*
					var RestanteApagarAlCentro = ctCentro - FaltaParaTopeAltoCostoPDSS;
					var ExedenteACopago = ctCentro - FaltaParaTopeAltoCostoPDSS;
					
					ctCopago = 	ctCopago + ExedenteACopago;
					ctCentro = 	FaltaParaTopeAltoCostoPDSS;
					ctPDSS = 	FaltaParaTopeAltoCostoPDSS;
					response.errorCod = 0;
					response.errorMsg = '9.4- Con Este Procedimiento El Afiliado a agotado el tope de alto Costo disponible, se ha llegado al tope de alto costo segun gradualidad . </br> Consumido Alto Costo :[' + consumidoAltCostPDSS + '] </br> Valor del proc. a pagar al centro:['+ ctCentro+']  Total a Pagar al Centro de la Auth Actual:['+ HTCentro +'] >= Tope Alto Costo:[' + topeAltCostGradualPDSS+']'; 				
					*/
				}
				
			}	
	}
		
	
	response.cantidad = ctCantidad;
	response.total = ctTotal;
	response.copago = ctCopago;
	response.pdss = ctPDSS;
	response.planes = ctPlanes;
	response.centro = ctCentro;
	response.tipoProc = tipoProc;
	
	return response;
}
