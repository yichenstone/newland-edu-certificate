var share_id =''
var password =''
var share_filename =''
//请求配置文件
$.ajax({ 
	type:"get", //使用get方式
	url: "https://newland-json.oss-cn-fuzhou.aliyuncs.com/config.json", //json文件相对于这个HTML的路径
	dataType:"json",
	async:false,
	success:function(data) {
		share_id = encodeURIComponent(data['share_id']);
		password = encodeURIComponent(data['password']);
		share_filename = encodeURIComponent(data['share_filename']);
	},
	error:function() {
		alert("请求失败");
	}
});

//获取根目录信息
var path = "https://newland-json.oss-cn-fuzhou.aliyuncs.com/json/"+share_filename+".json"
$.ajax({
	type:"get", //使用get方式
	url:path, //json文件相对于这个HTML的路径
	dataType:"json",
	success:function(data) {
		//这个data就是json数据
		// console.log(data)
		var items = data['data']['files'];
		var i=0;
		for(item in items){
			// console.log(items[i]['name']);
			var item_name = document.getElementById('item_name');
			var option = document.createElement('option');
			option.value=items[i]['path'];
			option.textContent=items[i]['name'];
			item_name.appendChild(option);
			i=i+1;
		}
	},
	error:function() {
		alert("请求失败");
	}
});

//下拉框初始默认选中数据获取
var name_id = new Array(); //存放具体证书名
var name_exam; //存放考试列表
window.onload = function(){
	var item_name = document.getElementById('item_name')
	setTimeout(3000); //需要一定的读取时间
	path = item_name.options[0].value;
	name_exam = path;
	path = "https://newland-json.oss-cn-fuzhou.aliyuncs.com/json"+encodeURIComponent(path)+'.json';
	$.ajax({
		type:"get", //使用get方式
		url: path, //json文件相对于这个HTML的路径
		dataType:"json",
		success:function(data) {
			//这个data就是json数据
			// console.log(data)
			var items = data['data']['files'];
			var i=0;
			name_id = new Array();
			for(item in items){
				name_id.push(items[i]['name'])
				i=i+1;
			}
			// console.log(name_id)
		},
		error:function() {
			alert("请求失败");
		}
	});
	return name_exam;
}

//下拉框选项改变获取新数据
function change(value){   
	// console.log(value);
	name_exam = value;
	path = "https://newland-json.oss-cn-fuzhou.aliyuncs.com/json"+encodeURIComponent(value)+'.json';
	// console.log(path);
	$.ajax({
		type:"get", //使用get方式
		url: path, //json文件相对于这个HTML的路径
		dataType:"json",
		success:function(data) {
			//这个data就是json数据
			// console.log(data)
			var items = data['data']['files'];
			var i=0;
			name_id = new Array();
			for(item in items){
				name_id.push(items[i]['name'])
				i=i+1;
			}
			// console.log(name_id)
		},
		error:function() {
			alert("请求失败");
		}
	});
	return name_exam;
}  

// 校验身份证
function isIdCard(idCard) {
	var idcard = document.getElementById('idcard')
	// 15位和18位身份证号码的正则表达式
	var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

	// 如果通过该验证，说明身份证格式正确，但准确性还需计算
	if (regIdCard.test(idCard)) {
		if (idCard.length == 18) {
			var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10,
					5, 8, 4, 2); // 将前17位加权因子保存在数组里
			var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
			var idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
			for (var i = 0; i < 17; i++) {
				idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
			}

			var idCardMod = idCardWiSum % 11;// 计算出校验码所在数组的位置
			var idCardLast = idCard.substring(17);// 得到最后一位身份证号码

			// 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
			if (idCardMod == 2) {
				if (idCardLast == "X" || idCardLast == "x") {
					//alert("恭喜通过验证啦！");
					return true;
				} else {
					//alert("身份证号码错误！");
					idcard.style.display = 'block';
					setTimeout(()=>idcard.style.display = 'none',3000)
					return false;
				}
			} else {
				// 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
				if (idCardLast == idCardY[idCardMod]) {
					//alert("恭喜通过验证啦！");
					return true;
				} else {
					//alert("身份证号码错误！");
					idcard.style.display = 'block';
					setTimeout(()=>idcard.style.display = 'none',3000)
					return false;
				}
			}
		}else{
			return true;
		}
	} else {
		idcard.style.display = 'block';
		setTimeout(()=>idcard.style.display = 'none',3000)
		return false;
	}
}

// 提交事件
function MyClick(){
	var myinput = document.getElementById("myinput");
	var haveFind = document.getElementById('haveFind');
	var noFind = document.getElementById('noFind');
	haveFind.style.display='none';
	noFind.style.display='none';
	// isIdCard(myinput.value)
	if(isIdCard(myinput.value)){
		var a=0;
		for(item in name_id){
			if(name_id[a].search(myinput.value)!= -1){
				var name_detail = name_id[a];
				var timestamp = Date.parse(new Date());
				var dlink = name_exam+'/'+ name_detail;
				var downPathOut = 'https://112.111.22.88:15001/fsdownload/webapi/file_download.cgi/新大陆教育证书_'+name_detail+'?dlink=%22'+toHex(dlink)+'%22&noCache='+timestamp+'&_sharing_id=%22'+share_id+'%22&api=SYNO.FolderSharing.Download&version=2&method=download&mode=download&stdhtml=false'
				var downPathIn = 'https://192.168.134.10:5001/fsdownload/webapi/file_download.cgi/新大陆教育证书_'+name_detail+'?dlink=%22'+toHex(dlink)+'%22&noCache='+timestamp+'&_sharing_id=%22'+share_id+'%22&api=SYNO.FolderSharing.Download&version=2&method=download&mode=download&stdhtml=false'
				var outNetDown = document.getElementById('outNetDown');
				outNetDown.href = downPathOut;
				var inNetDown = document.getElementById('inNetDown');
				inNetDown.href = downPathIn;
				haveFind.style.display='block';
				return name_detail;
			}
			a=a+1;
		}
		noFind.style.display='block';
	}
}

// 外网认证
function OutNet(){
	var shareUrlOut = 'https://112.111.22.88:15001/sharing/webapi/entry.cgi/SYNO.Core.Sharing.Login?api=SYNO.Core.Sharing.Login&method=login&version=1&sharing_id=%22'+share_id+'%22&password=%22'+password+'%22'
	var myWindow = window.open(shareUrlOut);
	setTimeout(function(){ myWindow.close() }, 1000);
}

// 内网认证
function InNet(){
	var shareUrlOut = 'https://192.168.134.10:5001/sharing/webapi/entry.cgi/SYNO.Core.Sharing.Login?api=SYNO.Core.Sharing.Login&method=login&version=1&sharing_id=%22'+share_id+'%22&password=%22'+password+'%22'
	var myWindow = window.open(shareUrlOut);
	setTimeout(function(){ myWindow.close() }, 1000);
}

// base16(Hex)编码和解码
function toHex(s) {
    // utf8 to latin1
    var s = unescape(encodeURIComponent(s))
    var h = ''
    for (var i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16)
    }
    return h
}

function fromHex(h) {
    var s = ''
    for (var i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
}

console.log(navigator.platform) //判断用户的操作平台，方便针对不同平台做一些界面调整