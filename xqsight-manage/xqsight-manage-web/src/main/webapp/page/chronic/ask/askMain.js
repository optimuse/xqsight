/**
 * Created by user on 2015/12/14.
 */

saicfc.nameSpace.reg("xqsight.chronic");

(function(){
    xqsight.chronic.askMain = function(){
        var ctxData = saicfc.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.cms}
         */
        var obj = this;
        /**
         * 列表对象
         *
         * @type {{}}
         */
        this.askTable = {};

        /**
         * 初始化调用 function
         */
        this.init = function() {
            /**
             * 查询
             */
            $(".btn-search").click(function(){
                obj.askTable.ajax.reload();
            });

            $(document).bind("keydown",".filter input",function(e){
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which;
                if (code == 13) {
                    obj.askTable.ajax.reload();
                }
            });

            /**
             * 重置
             */
            $("#btn-undo").click(function(){
                saicfc.utils.cleanValue(".filter");
            });

            $("#btn-reply").on("click",obj.forumFun);

            /**
             * 加载列表
             */
            obj.loadAskTableFun();
        };

        /**
         * 回复 function
         */
        this.forumFun = function(articleId){
        	var href="chronic/ask/askManage.html?articleId=" + articleId;
        	window.top.index.addTabPageFun(articleId,"咨询回复",href);
        }

        /**
         * 加载数据表 function
         */
        this.loadAskTableFun = function(){
            var record_table = $("#ask-table").DataTable({
                "oLanguage" : { // 汉化
                    sUrl : saicfc.utils.getServerPath("dataTableLocal")
                },
                "bAutoWidth" : false,
                "bFilter" : false,// 搜索栏
                "bLengthChange" : false,// 每行显示记录数
                "iDisplayLength" : 15,// 每页显示行数
                "bSort" : false,
                "bInfo" : true,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "sPaginationType" : "full_numbers", // 分页，一共两种样式 另一种为two_button // 是datatables默认
                "bServerSide" : true,
                "sAjaxSource": ctxData + '/ask/query?modelCode=' + $.getUrlParam("modelCode"),
                "fnServerData": function (sUrl, aoData, fnCallback) {
                    $.ajax({
                        "url": sUrl,
                        data: aoData,
                        "success": function(data){
                            fnCallback(data);
                            //渲染结束重新设置高度
                            parent.saicfc.common.setIframeHeight($.getUrlParam(saicfc.iframeId));
                        },
                        "dataType": "jsonp",
                        "cache": false
                    });
                },
                "fnServerParams": function (aoData) {
                    aoData.push(
                        { "name": "articleTitle", "value": $("#articleTitle").val() }
                    );
                },
                "aoColumnDefs": [
                    {
                        sDefaultContent: '',
                        aTargets: [ '_all' ]
                    }
                ],
                "aoColumns": [{
                    data: "articleTitle",
                    sWidth : "160",
                    sClass : "text-center",
                    sSort : false
                },{
                    data: "articleDescription",
                    sWidth : "160",
                    sClass : "text-center",
                    sSort : false
                },{
                    data: "createTime",
                    sWidth : "120",
                    sClass : "text-center",
                    render : function(value){
                        return saicfc.moment.formatYMDHms(value);
                    }
                },{
                    data: "articleId",
                    sWidth : "60",
                    sClass : "text-center",
                    render : function(value){
                         return '<button class="btn btn-xs btn-danger" onclick="askMain.forumFun(' + value + ')">回复</button>';
                    }
                }]
            });

            obj.askTable = record_table;

            //单选事件
            $("#ask-table tbody").on("click","tr",function() {
                $("#ask-table>tbody>tr").removeClass("success");
                $(this).addClass("success");
            });
        }

        /**
         *
         * 新增编辑回调函数
         *
         */
        this.editCallBackFun = function(params){
            //加载数据
            obj.askTable.ajax.reload();
            if(params.articleId== undefined || params.articleId =="" ){
                return;
            }
            //选中之前选中的数据

        }
    };

    /**
     * 初始化数据
     */
    $(document).ready(function() {
        askMain.init();
    });
})();
var askMain = new xqsight.chronic.askMain();





