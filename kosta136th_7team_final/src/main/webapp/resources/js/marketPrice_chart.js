//chart를 그리는 javascript 코드
//방법1

$(document).ready(function () {
	// 처음 시작시 PRICE_BTC값이 나타나는 쿼리
	var url = "/rate/bitrate?money_type=PRICE_USD&sorting_type=Volume_24h";
	
		$.getJSON(url, function (data) {
		
			var str = "";

				$.each(data, function(){
//					.reverse()
	        	    str += "<tr class='table_row' id='table_price_row'>";
	                str += "<td>" + this.label + "</td>";
	                str += "<td>" + this.name + "</td>";
	                str += "<td>" + this.price + "</td>";
	                str += "<td>" + this.volume_24h + "</td>";
	            	str += "</tr>";
				}); 
		
			$("#bitrate").html(str);
      
		});
	
	$(document).on("click", "#table_price_row", function(){
		
		var coinName = $(this).children(':eq(1)').text();
		var moneyType = $("#combo-box_moneyType").find(":selected").val();
		
		var money_name_option;
		if(moneyType == "PRICE_BTC") {
			money_name_option = "BTC";
		} else if (moneyType == "PRICE_USD") {
			money_name_option = "USD";
		} else if (moneyType == "PRICE_CNY") {
			money_name_option = "CNY";
		} else if (moneyType == "PRICE_EUR") {
			money_name_option = "EUR";
		} else if (moneyType == "PRICE_GBP") {
			money_name_option = "GBP";
		} else if (moneyType == "PRICE_RUR") {
			money_name_option = "RUR";
		}
		
		
		var options = {

//				title: {
//					//차트 제목 설정
//					text: '비트코인 시세정보 차트'
//		          },
				
				rangeSelector: {
					
					//기간 버튼 설정
					buttons: [
						{
		                    type: 'hour',
		                    count: 12,
		                    text: '12h'
		                }, {
		                    type: 'day',
		                    count: 1,
		                    text: '1D'
		                }, {
		                    type: 'day',
		                    count: 3,
		                    text: '3D'
		                }, {
		                    type: 'day',
		                    count: 7,
		                    text: '1w'
		                }, {
		                    type: 'all',
		                    count: 1,
		                    text: 'All'
		                }],
					//기간 버튼 Default 값 설정 //0: 가장 첫 기간버튼, 1: 두 번째 기간버튼, 2: 세...
					selected: 4,
		          },
				
				chart: {
					// 뿌려줄 View단의 id 설정
					renderTo : 'chart',
					// 그래프 타입(디자인) 설정
					// type : 'area'
				},
				
				series : [{
					name: money_name_option,
		            tooltip: {
		            valueDecimals: 2,
		            type: 'area'
		            }
				}]			
			};
		
		
		$.ajax({
			
			url : "/rate/oneChart/",
			type : 'get',
			data : {"coinName" : coinName, "moneyType" : moneyType},
			
			success : function() {
				
				var url = "/rate/oneChart?coinName=" + coinName + "&moneyType=" + moneyType;

				$.getJSON(url, function(data) {
					
					options.series[0].data = data;
					var chart = new Highcharts.stockChart(options);
					
				});
				
			}
			
		});
		
	});

	//실화폐 환율
	$(".market_price_tab").click(function(){
		
		var url = "/rate/rateList";		//MarketPriceDataController로 부터 받은 데이터를 처리한다.
		
		$.getJSON(url, function (data) {
			
			var str = "";

			$.each(data, function(){
				
				str += "<tr>";						
				str +=	"<td>" + this.id + "</td>";					
				str +=	"<td>" + this.name + "</td>";					
				str +=	"<td>" + this.rate + "</td>";					
				str +=	"<td>" + this.ask + "</td>";					
				str +=	"<td>" + this.bid + "</td>";					
				str += "</tr>";
				
			});

			 $("#rate").html(str);
		  
	  	});
		
	});
	
	var money_type = "PRICE_BTC";
	var sorting_type = "Volume_24h";	//default 정렬 기준은 24시간 거래량 기준.
	//비트코인환율
	$("#combo-box_moneyType").on('change', function(){
		
		money_type = $(this).find(":selected").val();
		
		$.ajax({
			
			url: "/rate/bitrate/",				//목적지 URI	//Controller로 보낸다.
			//async : false,						//동기방식
			type: 'get',							//get 타입 (post타입 등이 있음)
			data: {"money_type" : money_type, "sorting_type" : sorting_type},		//money_type을 넘긴다.
			
			success:  function () {				//성공시 return된 객체를
				
				var url = "/rate/bitrate?money_type=" + money_type + "&sorting_type=" + sorting_type;		//MarketPriceDataController로 부터 받은 데이터를 처리한다.
				
				$.getJSON(url,  function (data) {
					
					var str = "";
				                                                                                                      
	                $.each(data.reverse(), function(){
	               	    
	               	    str += "<tr class='table_row' id='table_price_row'>";
	                    str += "<td>" + this.label + "</td>";
	                    str += "<td>" + this.name + "</td>";
		                str += "<td>" + this.price + "</td>";
		                str += "<td>" + this.volume_24h + "</td>";
	                    str += "</tr>"
	                    
	                });       

	                $("#bitrate").html(str);

			  });
				
			}
			
		});
						
	});
	
	
	/* 정렬 타입 선택 콤보박스 메소드 */
	// 디폴트 상태 : 24시간 거래량 순
		
	
	$("#combo-box_sortingType").on('change', function(){
		
		money_type = $("#combo-box_moneyType").find(":selected").val();
		sorting_type = $(this).find(":selected").val();
		
		$.ajax({
			
			url: "/rate/bitrate/",				//목적지 URI	//Controller로 보낸다.
			//async : false,						//동기방식
			type: 'get',							//get 타입 (post타입 등이 있음)
			data: {"money_type" : money_type, "sorting_type" : sorting_type},		//money_type을 넘긴다.
			
			success:  function () {				//성공시 return된 객체를
				
				var url = "/rate/bitrate?money_type=" + money_type + "&sorting_type=" + sorting_type;		//MarketPriceDataController로 부터 받은 데이터를 처리한다.
				
				$.getJSON(url,  function (data) {
					
					var str = "";
				                                                                                                      
	                $.each(data, function(){
	               	    
	               	    str += "<tr class='table_row' id='table_price_row'>";
	                    str += "<td>" + this.label + "</td>";
	                    str += "<td>" + this.name + "</td>";
		                str += "<td>" + this.price + "</td>";
		                str += "<td>" + this.volume_24h + "</td>";
	                    str += "</tr>"
	                    
	                });       

	                $("#bitrate").html(str);

			  });
				
			}
			
		});
						
	});	
	
	
	
	
	/******* CHART 시작 ********/
	// options.series[0].data  = data; 코드 때문에 수시로 초기화해줘야한다.
	// !! 코드 정리 필요
	
	// document - ready 상태일 때
	// default 상세일 때
	var options = {

//				title: {
//					//차트 제목 설정
//					text: '비트코인 시세정보 차트'
//		          },
				
				rangeSelector: {
					
					//기간 버튼 설정
					buttons: [
						{
		                    type: 'hour',
		                    count: 12,
		                    text: '12h'
		                }, {
		                    type: 'day',
		                    count: 1,
		                    text: '1D'
		                }, {
		                    type: 'day',
		                    count: 3,
		                    text: '3D'
		                }, {
		                    type: 'day',
		                    count: 7,
		                    text: '1w'
		                }, {
		                    type: 'all',
		                    count: 1,
		                    text: 'All'
		                }],
					//기간 버튼 Default 값 설정 //0: 가장 첫 기간버튼, 1: 두 번째 기간버튼, 2: 세...
					selected: 4,
		          },
				
				chart: {
					// 뿌려줄 View단의 id 설정
					renderTo : 'chart',
					// 그래프 타입(디자인) 설정
					// type : 'area'
				},
				
				series : [{
					name: 'USD',
		            tooltip: {
		            valueDecimals: 2
		            }
				}]			
		};
		
	
	
	var money_type = "PRICE_USD";
	$("#combo-box_moneyType").on('change', function(){

		money_type = $(this).find(":selected").val();		//선택된 값을 가져옴.
		
		// money_name_option는 화폐 종류 그래프에 출력할 값을 저장하는 변수(USD, CNY, BTC...)
		var money_name_option;
		if(money_type == "PRICE_USD") {
			money_name_option = "USD";
		} else if (money_type == "PRICE_CNY") {
			money_name_option = "CNY";
		} else if (money_type == "PRICE_EUR") {
			money_name_option = "EUR";
		} else if (money_type == "PRICE_GBP") {
			money_name_option = "GBP";
		} else if (money_type == "PRICE_RUR") {
			money_name_option = "RUR";
		} else if (money_type == "PRICE_BTC") {
			money_name_option = "BTC";
		} 
		
		
		var options = {

//				title: {
//					//차트 제목 설정
//					text: '비트코인 시세정보 차트'
//		          },
				
				rangeSelector: {
					
					//기간 버튼 설정
					buttons: [
						{
		                    type: 'hour',
		                    count: 12,
		                    text: '12h'
		                }, {
		                    type: 'day',
		                    count: 1,
		                    text: '1D'
		                }, {
		                    type: 'day',
		                    count: 3,
		                    text: '3D'
		                }, {
		                    type: 'day',
		                    count: 7,
		                    text: '1w'
		                }, {
		                    type: 'all',
		                    count: 1,
		                    text: 'All'
		                }],
					//기간 버튼 Default 값 설정 //0: 가장 첫 기간버튼, 1: 두 번째 기간버튼, 2: 세...
					selected: 4,
		          },
				
				chart: {
					// 뿌려줄 View단의 id 설정
					renderTo : 'chart',
					// 그래프 타입(디자인) 설정
					// type : 'area'
				},
				
				series : [{
					name: money_name_option,
		            tooltip: {
		            valueDecimals: 2,
		            type: 'area'
		            }
				}]			
			};
			
		
		
		
		$.ajax({
			
			url : "/rate/oneChart/",
			type : 'get',
			data : {"coinName" : coinName, "moneyType" : moneyType},
			
			success : function() {
				
				var url = "/rate/oneChart?coinName=" + coinName + "&moneyType=" + moneyType;

				$.getJSON(url, function(data) {
					
					options.series[0].data = data;
					var chart = new Highcharts.stockChart(options);
					
				});
				
			}
			
		});
			
	});
	
	//MarketPriceDataController.java
	//@RequestMapping(value = "/chartData") ++ @RequestMapping("/rate/*")
	//초기값은 btc로 설정.
	var url = "/rate/oneChart?coinName=Bitcoin&moneyType=PRICE_USD";		//MarketPriceDataController로 부터 받은 데이터를 처리한다.
	$.getJSON(url,  function (data) {
		
		options.series[0].data  = data;
		var chart = new Highcharts.stockChart(options);
	  
  });
	
});