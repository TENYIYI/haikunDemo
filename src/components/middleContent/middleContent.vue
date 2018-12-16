<template>
  <div
    id="app"
    v-cloak
  >
    <div id="nav">
      <div
        class="nav-item"
        :class="{active:nav_tab==0}"
        @click="navTabChange(0)"
      >排位站队</div>
      <div
        class="nav-item"
        :class="{active:nav_tab==1}"
        @click="navTabChange(1)"
      >虚拟用户</div>
      <div
        class="nav-item"
        :class="{active:nav_tab==2}"
        @click="navTabChange(2)"
      >基本设置</div>
      <!-- <div class="nav-item" :class="{active:nav_tab==3}" @click="navTabChange(3)">页面设置</div> -->
    </div>
    <!-- 排位站队 -->
    <div
      id="sort"
      :style="{display:nav_tab==0?'block':'none'}"
    >
      <el-form
        class="search"
        :model="searchForm_1"
        label-width="80px"
        size="small"
      >
        <el-col :span="4">
          <el-form-item label="用户ID">
            <el-input
              v-model="searchForm_1.user_id"
              placeholder="请输入用户ID"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="产品ID">
            <el-input
              v-model="searchForm_1.order_id"
              placeholder="请输入产品ID"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="用户身份">
            <el-select
              v-model="searchForm_1.card_state"
              clearable
              placeholder="请选择"
              size="small"
            >
              <el-option
                label="真实用户"
                :value="1"
              ></el-option>
              <el-option
                label="虚拟用户"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="订单状态">
            <el-select
              v-model="searchForm_1.isvalid"
              clearable
              placeholder="请选择"
              size="small"
            >
              <el-option
                label="队列中"
                :value="1"
              ></el-option>
              <el-option
                label="已出局"
                :value="0"
              ></el-option>
              <el-option
                label="复投"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="奖励发放">
            <el-select
              clearable
              placeholder="请选择"
              v-model="searchForm_1.reward"
              size="small"
            >
              <el-option
                label="未发放"
                :value="0"
              ></el-option>
              <el-option
                label="已发放"
                :value="1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="开始时间"
            style="float:left"
          >
            <el-date-picker
              v-model="searchForm_1.careate_start"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="结束时间"
            style="float:left"
          >
            <el-date-picker
              v-model="searchForm_1.careate_end"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
          <el-button
            @click="search_o(1)"
            type="primary"
            icon="el-icon-search"
            size="small"
            style="margin-left:10px"
          >搜索</el-button>
          <el-button
            @click="sendAllRewards"
            type="primary"
            icon="el-icon-message"
            size="small"
            style="margin-left:10px"
          >一键发放奖励</el-button>
          <el-button
            type="primary"
            @click="invertedOrder"
            size="small"
            icon="el-icon-sort"
            style="margin-left:10px"
          >表格倒序</el-button>
          <el-button
            @click="loadExcel"
            type="primary"
            size="small"
            icon="el-icon-download"
            style="margin-left:10px"
          >导出Excel表格</el-button>
        </el-col>
      </el-form>
      <el-table
        :data="order_list.real"
        border
        stripe
        style="width: 100%"
        @select="selectOrder"
        size="small"
      >
        <el-table-column
          type="selection"
          width="35"
          :selectable="selectable"
        >
        </el-table-column>
        <el-table-column
          prop="acc_user"
          label="排位"
          width="65"
        ></el-table-column>
        <el-table-column
          prop="batchcode"
          label="订单编号"
          width="220"
        >
        </el-table-column>
        <el-table-column
          label="购买用户"
          width="250"
        >
          <template scope="scope">
            <p
              class="user-small user"
              :class="{sham:scope.row.card_state==2}"
              @click="showUserMsg(scope.row)"
            >{{scope.row.weixin_name}}
              <span>(id:{{scope.row.user_id}})</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="排队时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="活动产品"
          width="250"
        >
          <template scope="scope">
            <p class="user-small">{{scope.row.name}}
              <span>(id:{{scope.row.product_id}})</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="130"
        >
          <template scope="scope">
            <p v-if="scope.row.state==0&&scope.row.isvalid==1">自主购买</p>
            <p v-if="scope.row.state==1&&scope.row.isvalid==1">复投</p>
            <p
              v-if="scope.row.isvalid==0"
              class="out"
            >已出局</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="'手机号('+basesetForm.account_name+')'"
          width="160"
        >
          <template scope="scope">
            <p v-if="scope.row.phone==0||scope.row.phone==''"></p>
            <p v-else>{{scope.row.phone}}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="basesetForm.account_name||'云联惠账号'"
          min-width="230"
        >
          <template scope="scope">
            <p
              class="user-small"
              @click="showUserMsg(scope.row)"
            >{{scope.row.account_number}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template scope="scope">
            <!-- <el-tooltip v-if="scope.row.isvalid==1" class="item" effect="dark" content="手动出局" placement="bottom-start">
              <i class="el-icon-circle-check" @click="account_out(scope.row)" style="margin-right:8px;color:#20A0FF;"></i>
            </el-tooltip> -->
            <el-tooltip
              v-if="scope.row.isvalid==0&&scope.row.card_state==1&&(scope.row.reward==0||scope.row.reward==null)"
              class="item"
              effect="dark"
              content="发放积分奖励"
              placement="bottom-start"
              size="small"
            >
              <i
                class="el-icon-message"
                @click="sendRewards(scope.row)"
                style="margin-right:8px;color:#FF4949;"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.isvalid==0&&scope.row.card_state==1&&scope.row.reward==1"
              class="item"
              effect="dark"
              content="奖励已发放"
              size="small"
              placement="bottom-start"
            >
              <i
                class="el-icon-message"
                style="margin-right:8px;color:#ccc;"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <p style="color:#FF4949;padding:10px;font-size:15px;float:left;">提示：红色字体标明用户为虚拟用户</p>
      <el-pagination
        class="page"
        ref="page_o"
        @current-change="search_o"
        :page-size="12"
        layout="total, prev, pager, next, jumper"
        :total="order_list.count"
      >
      </el-pagination>
      <div class="show-user-msg">
        <h4>用户信息</h4>
        <el-form
          :model="userMsgFrom"
          label-width="100px"
        >
          <div class="head">
            <img :src="userMsgFrom.weixin_headimgurl">
          </div>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="ID:">
              <p>{{userMsgFrom.id}}</p>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="微信名称:">
              <p>{{userMsgFrom.weixin_name}}</p>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="qq:">
              <p>{{userMsgFrom.qq||'未知'}}</p>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="手机:">
              <p v-if="userMsgFrom.account_phone==0">未绑定</p>
              <p v-else>{{userMsgFrom.account_phone}}</p>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="地址:">
              <p>{{userMsgFrom.province+userMsgFrom.city}}</p>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item :label="basesetForm.account_name+':'">
              <p v-if="userMsgFrom.account_number==0">未绑定</p>
              <p v-else>{{userMsgFrom.account_number}}</p>
            </el-form-item>
          </el-col>
        </el-form>
        <div
          class="close"
          @click="hiddenUserMsg"
        >
          <i
            class="el-icon-close"
            style="margin-right:10px;color:#FF4949;"
          ></i>
        </div>
      </div>
    </div>
    <!-- 虚拟用户表 -->
    <div
      id="user-list"
      :style="{display:nav_tab==1?'block':'none'}"
    >
      <el-form
        class="search"
        label-width="80px"
      >
        <el-col :span="4">
          <el-button
            @click="addUser('add')"
            type="primary"
            style="margin-left:20px;margin-bottom:20px;"
          >
            <i class="el-icon-plus el-icon--right"></i>新增虚拟用户</el-button>
        </el-col>
      </el-form>
      <el-table
        :data="user_list.data"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column label="管理员">
          <template scope="scope">
            <p class="user-small">{{scope.row.user_id}}
              <span>({{scope.row.weixin_name}})</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="son_user_id"
          label="用户子ID"
        >
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <p v-if="scope.row.state==1">占位中</p>
            <p v-else>未占位</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="bottom-start"
            >
              <i
                @click="edit_u(scope.row)"
                class="el-icon-edit"
                style="margin-right:10px;color:#20A0FF;"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="bottom-start"
            >
              <i
                class="el-icon-delete"
                @click="delete_u(scope.row)"
                style="margin-right:10px;color:#FF4949;"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.defaultt===0"
              class="item"
              effect="dark"
              content="选择占位"
              placement="bottom-start"
            >
              <i
                class="el-icon-setting"
                @click="select_u(scope.row)"
                style="margin-right:10px;color:#cccccc;"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.defaultt===1"
              class="item"
              effect="dark"
              content="已选择"
              placement="bottom-start"
            >
              <i
                class="el-icon-setting"
                style="margin-right:10px;color:#009933;"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        ref="page_u"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="user_list.count"
        @current-change="currentPage_u"
      >
      </el-pagination>
      <div class="add-user">
        <h4 v-if="currentType=='add'">添加虚拟用户</h4>
        <h4 v-if="currentType=='edit'">编辑虚拟用户</h4>
        <el-form
          :model="addUserFrom"
          label-width="100px"
        >
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="用户ID:">
              <el-input
                v-model="addUserFrom.user_id"
                placeholder="仅支持数字"
                :disabled="currentType=='edit'?true:false"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
          >
            <el-form-item label="用户子ID:">
              <el-input
                v-model="addUserFrom.son_user_id"
                placeholder="仅支持数字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="16"
            :offset="4"
            style="display:flex;justify-content:center;margin-top:20px;"
          >
            <el-button
              type="primary"
              @click="saveUser"
            >保存</el-button>
          </el-col>
        </el-form>
        <div
          class="close"
          @click="closeAddcard"
        >
          <i
            class="el-icon-close"
            style="margin-right:10px;color:#FF4949;"
          ></i>
        </div>
      </div>
    </div>
    <div
      id="baseset"
      :style="{display:nav_tab==2?'block':'none'}"
      style="height:600px;padding-top:20px"
    >
      <el-form
        ref="form"
        :model="basesetForm"
        label-width="200px"
      >
        <el-form-item label="虚实订单比例插入">
          <el-switch
            v-model="basesetForm.status"
            :active-value="1"
            :inactive-value="0"
            on-color="#13ce66"
            off-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="虚实订单比例设置">
          <el-col :span="2">
            <el-input
              placeholder="实际订单"
              v-model="basesetForm.column_real"
            ></el-input>
          </el-col>
          <el-col
            class="line"
            :span="1"
            style="text-align: center;"
          >-</el-col>
          <el-col :span="2">
            <el-input
              placeholder="虚拟订单"
              v-model="basesetForm.column_empty"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="出局比例设置">
          每进
          <el-input
            placeholder="整数"
            v-model="basesetForm.achieve"
            style="width:100px;margin-left:10px;margin-right:10px;"
          ></el-input>人， 出局
          <el-input
            placeholder="整数"
            v-model="basesetForm.account_out"
            style="width:100px;margin-left:10px;margin-right:10px;"
          ></el-input>人
        </el-form-item>
        <el-form-item label="虚拟用户出局操作">
          <el-radio-group v-model="basesetForm.choice_status">
            <el-radio :label="0">享受积分奖励，复投1次</el-radio>
            <el-radio :label="1">出局，然后再占n个位置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="享受积分奖励">
          <el-input
            placeholder="请输入"
            style="width:200px;"
            v-model="basesetForm.enjoy_integral"
          ></el-input>
        </el-form-item>
        <el-form-item label="虚拟用户出局占位个数">
          <el-input
            placeholder="请输入"
            style="width:200px;"
            v-model="basesetForm.seating"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联账号名称">
          <el-input
            placeholder="请输入"
            style="width:200px;"
            v-model="basesetForm.account_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择排队商品">
          <p
            style="color:#20A0FF;cursor:pointer;"
            @click="selectProductCardStatusChange"
          >{{basesetForm.product_name||'请选择'}}</p>
        </el-form-item>
        <el-form-item label="">
          <el-button
            @click="editBaseset"
            type="primary"
            style="padding-left:30px;padding-right:30px"
          >保存</el-button>
        </el-form-item>
      </el-form>
      <div
        class="cont product"
        v-if="selectProductCardStatus"
      >
        <h3 class="title">选择商品</h3>
        <el-row
          class="search"
          :gutter="20"
        >
          <el-col :span="8">
            <el-cascader
              :options="total_type_list"
              :props="{value:'id',label:'name',children:'_child'}"
              change-on-select
              size="small"
              @change="currentTypeChange"
            ></el-cascader>
          </el-col>
          <el-col :span="8">
            <el-input
              size="small"
              placeholder="请输入商品关键字"
              v-model="search_keyword"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <el-button
              size="small"
              type="primary"
              @click="searchProduct(1)"
            >搜索</el-button>
          </el-col>
        </el-row>
        <el-row class="product-list">
          <el-col
            :span="8"
            class="product-item"
            v-for="(item,index) in product_list.value"
          >
            <div
              class="product-cont"
              @click="selectCurrentProduct(item)"
            >
              <img :src="item.default_imgurl">
              <div class="product-msg">
                <div class="name">{{item.name}}</div>
                <div class="price">原价￥{{item.now_price}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-pagination
            class="page"
            layout="prev, pager, next"
            :page-size="12"
            :total="product_list.count"
            @current-change="currentData"
          >
          </el-pagination>
        </el-row>
        <i
          class="el-icon-close close"
          @click="closeMessagebox"
        ></i>
      </div>
    </div>
    <!-- <div id="viewset" :style="{display:nav_tab==3?'block':'none'}" style="height:600px;padding-top:20px">
      <el-row>
        <el-col :span="4" class="phone">
          <div class="img" style="width:100%;">
            <img src="http://admin.sinlu.net/public/upload/img/1515205173727.jpg" style="width:100%;height:auto;display:block" />
          </div>
          <div class="list">
            <span>我的奖励：</span>
            <span style="color:#000;font-size:20px;">无</span>
          </div>
          <div class="list">
            <span>等级：</span>
            <span>普通会员</span>
          </div>
          <div class="list">
            <p>正在排位：</p>
            <p>排位：{{0}}，已经排位次数：{{0}}</p>
          </div>
          <div class="list last">
            <p>排位统计：</p>
            <p>排位人数：{{0}}，总购买次数：{{0}}</p>
          </div>
        </el-col>
        <el-col :span="2" style="margin-left:20px;">
          <h4>点击上传图片</h4>
          <el-upload class="upload-demo" action="http://admin.sinlu.net/smallroutine/program/upload/customer_id/" :on-success="uploadSuccess"
            name="img">
            <img src="http://admin.sinlu.net/public/upload/img/1515205173727.jpg" style="width:100%;height:auto;display:block;border:1px solid #ddd;"
            />
          </el-upload>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-button type="primary" style="margin-left:20px;padding:15px 50px;">保存</el-button>
      </el-row>
    </div> -->
  </div>
</template>

<script>
export default {
  data: {
    page: [1, 1],
    nav_tab: 0,
    hrefUrl: "",
    select_arr: [],
    searchForm_1: {
      card_state: "", //用户类型
      user_id: "",
      order_id: "",
      isvalid: "",
      reward: "",
      careate_start: "",
      careate_end: "",
      order: 0
    },
    userMsgFrom: "", //用户信息
    searchData: "",
    addUserFrom: {
      //添加、编辑虚拟用户
      user_id: "",
      son_user_id: ""
    },
    basesetForm: {
      status: 0, //0未开启；1为开启
      column_real: "", //实所占比例数
      column_empty: "", //虚所占比例数
      achieve: "", //每进多少人
      account_out: "", //出局多人
      enjoy_integral: "", //出局时用户享用多少积分
      seating: "", //出局（虚拟）的用户可以在占多少个位置
      choice_status: 0, //虚拟用户出局选择那个
      product_id: "",
      product_name: ""
    },
    currentType: "edit",
    user_list: "",
    order_list: "",
    order_url: "accoun",
    selectProductCardStatus: false,
    current_type: "", //选择商品或商品分类
    type_list: "",
    total_type_list: [],
    product_list: "",
    current_page: 1,
    search_keyword: "",
    currentProduct: ""
  },
  created() {
    var _this = this;
    this.hrefUrl = this.GetQueryString();
    console.log(this.hrefUrl);

    //排队列表
    $.ajax({
      type: "post",
      url: "/plat/Account/accoun",
      data: {
        customer_id: this.hrefUrl.customer_id,
        pagea: this.page[0]
      },
      success: function(res) {
        _this.order_list = res;
      }
    });

    //虚拟用户列表
    $.ajax({
      type: "post",
      url: "/plat/Account/select_fitch",
      data: {
        customer_id: this.hrefUrl.customer_id,
        pagea: this.page[1]
      },
      success: function(res) {
        _this.user_list = res;
      }
    });

    //基本设置
    $.ajax({
      type: "post",
      url: "/plat/Account/select_defaultt",
      data: {
        customer_id: this.hrefUrl.customer_id
      },
      success: function(res) {
        if (res) {
          _this.basesetForm = res;
        }
      }
    });
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },

    navTabChange(tab) {
      //切换列表
      this.nav_tab = tab;
    },

    addUser(type) {
      //新增虚拟用户按钮事件
      this.currentType = type;
      $(".add-user").css("display", "block");
    },

    closeAddcard() {
      //关闭弹框
      $(".add-user").css("display", "none");
    },

    edit_u(data) {
      this.addUserFrom.user_id = data.user_id;
      this.addUserFrom.son_user_id = data.son_user_id;
      this.addUserFrom.id = data.id;
      this.addUser("edit");
    },

    delete_u(data, index) {
      console.log(data);
      var _this = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          $.ajax({
            type: "post",
            url: "/plat/Account/del_fitch",
            data: {
              id: data.id
            },
            success: function(res) {
              if (res.code == 0) {
                _this.currentPage_u(_this.page[_this.nav_tab]);
                _this.$message.success(res.message);
              } else {
                _this.$message.error(res.message);
              }
            }
          });
        })
        .catch(function() {});
    },

    select_u(data) {
      var _this = this;
      $.ajax({
        type: "post",
        url: "/plat/Account/set_fitch",
        data: {
          id: data.id,
          customer_id: _this.hrefUrl.customer_id
        },
        success: function(res) {
          if (res.code == 0) {
            _this.currentPage_u(_this.page[_this.nav_tab]);
            _this.$message.success(res.message);
          } else {
            _this.$message.error(res.message);
          }
        }
      });
    },

    saveUser() {
      //新增、编辑虚拟用户
      var _this = this;
      if (
        this.addUserFrom.user_id === "" ||
        this.addUserFrom.son_user_id === ""
      ) {
        this.$message.error("请输入正确的ID，不能为空");
        return;
      }
      this.closeAddcard();
      this.addUserFrom.customer_id = this.hrefUrl.customer_id;
      var url =
        "/plat/Account/" +
        (this.currentType == "edit" ? "edit_fitch" : "add_fitch");
      $.ajax({
        type: "post",
        url: url,
        data: this.addUserFrom,
        success: function(res) {
          if (res.code === 0) {
            _this.currentPage_u(_this.page[_this.nav_tab]);
            _this.$message.success(res.message);
          } else {
            _this.$message.error(res.message);
          }
        }
      });
    },

    showUserMsg(row) {
      //展示用户信息
      if (row.card_state == 2) {
        return;
      }
      var _this = this;
      $.ajax({
        type: "post",
        url: "/plat/Account/inser",
        data: {
          customer_id: this.hrefUrl.customer_id,
          user_id: row.user_id
        },
        success: function(res) {
          _this.userMsgFrom = res;
        }
      });
      $(".show-user-msg").css("display", "block");
      // console.log(row.user_id)
    },
    hiddenUserMsg() {
      //隐藏用户信息
      $(".show-user-msg").css("display", "none");
    },

    search_o(e) {
      //搜索
      var _this = this;

      _this.page[this.nav_tab] = e;

      this.searchData = {
        card_state: this.searchForm_1.card_state, //用户类型
        user_id: this.searchForm_1.user_id,
        order_id: this.searchForm_1.order_id,
        isvalid: this.searchForm_1.isvalid == 2 ? 1 : this.searchForm_1.isvalid,
        state: this.searchForm_1.isvalid == 2 ? 1 : "",
        customer_id: _this.hrefUrl.customer_id,
        reward: this.searchForm_1.reward,
        careate_start: this.searchForm_1.careate_start,
        careate_end: this.searchForm_1.careate_end,
        order: this.searchForm_1.order,
        pagea: e
      };

      $.ajax({
        type: "post",
        url: "/plat/Account/accoun",
        data: this.searchData,
        success: function(res) {
          _this.order_list = res;
        }
      });
    },

    invertedOrder() {
      this.searchForm_1.order = this.searchForm_1.order == 0 ? 1 : 0;
      this.search_o(1);
    },

    selectable(row, index) {
      return row.isvalid == 0 && row.card_state == 1 && row.reward == 0
        ? true
        : false;
    },

    selectOrder(selection, row) {
      console.log("selection", selection);
      this.select_arr = selection;
    },

    sendAllRewards() {
      //一键发放奖励
      var _this = this;
      this.$confirm("确定一键发放奖励？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(function(value) {
          console.log(value.value);
          var arr = [];
          for (var i = 0; i < _this.select_arr.length; i++) {
            arr.push(_this.select_arr[i].id);
          }
          $.ajax({
            type: "post",
            url: "/plat/Account/put_on",
            data: {
              customer_id: _this.hrefUrl.customer_id,
              // score: value.value,
              select_arr: arr
            },
            success: function(res) {
              if (res.code == 0) {
                _this.search_o(_this.page[_this.nav_tab]);
                _this.$message.success(res.message);
              } else {
                _this.$message.error(res.message);
              }
            }
          });
        })
        .catch(function() {});
    },

    loadExcel() {
      var _this = this;

      var url =
        "/plat/Account/export?card_state=" +
        this.searchForm_1.card_state +
        "&user_id=" +
        this.searchForm_1.user_id +
        "&order_id=" +
        this.searchForm_1.order_id +
        "&isvalid=" +
        this.searchForm_1.isvalid +
        "&state=" +
        this.searchForm_1.state +
        "&customer_id=" +
        _this.hrefUrl.customer_id +
        "&reward=" +
        this.searchForm_1.reward +
        "&careate_start=" +
        this.searchForm_1.careate_start +
        "&careate_end=" +
        this.searchForm_1.careate_end;

      console.log(url);

      window.location = url;
    },

    //手动出局
    account_out(data) {
      var _this = this;
      $.ajax({
        type: "post",
        url: "/plat/Account/account_out",
        data: {
          customer_id: this.hrefUrl.customer_id,
          // user_id: data.user_id,
          id: data.id
        },
        success: function(res) {
          if (res.code == 0) {
            // _this.search_o(_this.page[_this.nav_tab]);
            data.isvalid = 0;
            data.card_state = 1;
            data.reward = 0;
            _this.$message.success(res.message);
          } else {
            _this.$message.error(res.message);
          }
        }
      });
    },

    //发放奖励
    sendRewards(data) {
      var _this = this;
      this.$confirm("确定发放奖励？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(function(value) {
          $.ajax({
            type: "post",
            url: "/plat/Account/choice",
            data: {
              customer_id: _this.hrefUrl.customer_id,
              card_state: data.card_state,
              user_id: data.user_id,
              id: data.id
              // score: value.value
            },
            success: function(res) {
              if (res.code == 0) {
                data.reward = 1;
                _this.$message.success(res.message);
              } else {
                _this.$message.error(res.message);
              }
            }
          });
        })
        .catch(function() {});
    },

    //上传图片成功
    uploadSuccess(res) {
      console.log(res);
    },

    currentPage_o(e) {
      var _this = this;
      _this.page[this.nav_tab] = e;
      $.ajax({
        type: "post",
        url: "/plat/Account/accoun",
        data: {
          customer_id: this.hrefUrl.customer_id,
          pagea: e
        },
        success: function(res) {
          _this.order_list = res;
        }
      });
    },

    currentPage_u(e) {
      var _this = this;
      _this.page[this.nav_tab] = e;
      $.ajax({
        type: "post",
        url: "/plat/Account/select_fitch",
        data: {
          customer_id: this.hrefUrl.customer_id,
          pagea: e
        },
        success: function(res) {
          _this.user_list = res;
        }
      });
    },

    editBaseset() {
      var _this = this;
      this.basesetForm.customer_id = this.hrefUrl.customer_id;
      //基本设置
      $.ajax({
        type: "post",
        url: "/plat/Account/defaultt",
        data: this.basesetForm,
        success: function(res) {
          if (res.code === 0) {
            _this.$message.success(res.message);
          } else {
            _this.$message.error(res.message);
          }
        }
      });
    },

    currentData(e) {
      var _this = this;
      this.current_page = e;
      if (this.current_type == "search") {
        this.searchProduct(e);
      }
      var url = "product",
        sendData = {
          customer_id: _this.hrefUrl.customer_id,
          pagea: e
        };

      if (this.current_type !== "") {
        sendData.type_id = this.current_type;
      }

      $.ajax({
        type: "post",
        url: "/plat/Account/" + url,
        data: sendData,
        success: function(res) {
          _this.product_list = res;
        }
      });
    },

    searchProduct(e) {
      this.current_type = "search";
      var _this = this;
      var sendData = {
          customer_id: _this.hrefUrl.customer_id,
          search: this.search_keyword,
          pagea: e
        },
        _this = this;

      $.ajax({
        type: "post",
        url: "/plat/Account/search",
        data: sendData,
        success: function(res) {
          _this.product_list = res;
        }
      });
    },

    selectProductCardStatusChange() {
      var _this = this;
      this.selectProductCardStatus = !this.selectProductCardStatus;
      $.ajax({
        type: "post",
        url: "/plat/Account/shop_type",
        data: {
          customer_id: _this.hrefUrl.customer_id
        },
        success: function(res) {
          _this.total_type_list = res;
        }
      });

      this.currentData(1);
    },

    selectCurrentProduct(data) {
      this.currentProduct = data;
      this.selectProductCardStatus = !this.selectProductCardStatus;
      this.basesetForm.product_id = data.id;
      this.basesetForm.product_name = data.name;
      console.log(this.basesetForm);
    },

    currentTypeChange(e) {
      this.current_type = e[e.length - 1];
      this.currentData(1);
      // console.log(e)
    },

    closeMessagebox() {
      this.selectProductCardStatus = !this.selectProductCardStatus;
    },

    GetQueryString() {
      //获取地址栏参数
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split("&"); //各个参数放到数组里
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          obj[name] = value;
        }
      }
      return obj;
    }
  }
};
</script>

<style>
</style>
