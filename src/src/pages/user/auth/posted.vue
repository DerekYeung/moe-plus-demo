<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div class="index" v-title data-title="注册信息">
    <header class="theme-background-gradient">
      <h2 class="title">{{ school.name }}</h2>
      <span class="tips">选择孩子班级以及录入基础信息</span>
      <v-touch tag="span" class="back-btn" @tap="clickBackBtn">
        <Icon name="zuojiantou" size="1.5rem"></Icon>
      </v-touch>
    </header>
    <div class="main-container">
      <div class="step-tip">{{ status === 'intro' ? '第一步：选择学校' : '第二步：填写信息'}}</div>
      <div class="main step-first" v-if="status === 'intro'">
        <div class="step-section">
          <form class="search-form">
            <div class="search-group">
              <input v-model="searchInput" class="search-input" type="text" value="" placeholder="在此输入学校名称"/>
              <v-touch tag="span" v-show="searchInput !== ''" class="refill-btn" @tap="clickRemoveBtn">
                <Icon name="cancel" color="#8a8a8a" size="24px"></Icon>
              </v-touch>
            </div>
            <div class="search-result"></div>
          </form>
        </div>
        <ul class="select-section" v-if="filterList.length > 0">
          <v-touch
            tag="li"
            class="item"
            v-for="item in filterList"
            :key="item.id"
            @tap="clickSelectBtn(item.name)">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-pos">{{ item.pos }}</p>
          </v-touch>
        </ul>
        <ul class="select-section" v-else-if="searchInput !== ''">
          <li class="item">
            <p class="item-name">未找到相关学校信息</p>
          </li>
        </ul>
      </div>
      <div class="main step-second" v-else>
        <div class="step-section">
          <form class="form">
            <div class="label theme-primary-color">学生班级<sup class="mixd">*</sup></div>
            <v-touch tag="div" class="search-group" @tap="openClassesSelect">
              <div class="search-select classes-select">
                <span class="class-name">{{ profile.className === '' ? '选择学生班级' : profile.className }}</span>
                <span class="icon">
                  <Icon name="dropdown" size="16px"></Icon>
                </span>
              </div>
            </v-touch>
            <div class="label theme-primary-color">学生姓名<sup class="mixd">*</sup></div>
            <div class="search-group">
              <input class="search-input" v-model="profile.name" name="name" type="text" value="" placeholder="输入学生姓名"/>
            </div>
            <div class="label theme-primary-color">与其关系<sup class="mixd">*</sup></div>
            <v-touch tag="div" class="search-group" @tap="openRelationSelect">
              <div class="search-select title-select">
                <span class="title-name">{{ profile.relation === '' ? '选择关系' : profile.relation }}</span>
                <span class="icon">
                  <Icon name="dropdown" size="16px"></Icon>
                </span>
              </div>
            </v-touch>
            <div class="label theme-primary-color">学生性别<sup class="mixd">*</sup></div>
            <v-touch tag="div" class="search-group" @tap="openGenderSelect">
              <div class="search-select gender-select">
                <span class="gender-name">{{ profile.genderText === '' ? '选择性别' : profile.genderText}}</span>
                <span class="icon">
                  <Icon name="dropdown" size="16px"></Icon>
                </span>
              </div>
            </v-touch>
            <div class="label theme-primary-color">学生照片</div>
            <div class="search-group">
              <helper-margin-block></helper-margin-block>
              <div class="student-avatar">
                <div class="avatar-btn" :style="{'background-image': 'url(' + profile.avatarPreview + ')'}">
                  <input type="file" accept="image/*" @change="getImage">
                  <Icon v-if="profile.avatarPreview === ''" name="upload" color="#8a8a8a" size="24px"></Icon>
                </div>
              </div>
              <div class="upload-tip">上传照片有助于老师分辨，加大审核通过率</div>
              <helper-margin-block></helper-margin-block>
            </div>
          </form>
          <van-popup v-model="showClassesSelect" position="bottom">
            <van-picker
              show-toolbar
              :columns="classesSelectValues"
              @change="onChange"
              @confirm="onClassesConfirm"
              @cancel="showClassesSelect = false"
            />
          </van-popup>
          <van-popup v-model="showRelationSelect" position="bottom">
            <van-picker
              show-toolbar
              :columns="relationSelectValues"
              @confirm="onRelationSelectConfirm"
              @cancel="showRelationSelect = false"
            />
          </van-popup>
          <van-popup v-model="showGenderSelect" position="bottom">
            <van-picker
              show-toolbar
              :columns="genderSelectValues"
              @confirm="onGenderSelectConfirm"
              @cancel="showGenderSelect = false"
            />
          </van-popup>
        </div>
      </div>
    </div>
    <footer>
      <v-touch tag="a" class="next-btn theme-background-gradient" @tap="clickNextBtn" :class="{disable: !canPost}">下一步</v-touch>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'common-auth-infoSchool',
  data() {
    return {
      timer: null,
      school: {},
      status: 'text',

      /**
         *  intro 状态 方法
         */

      alternative: [], // 学校备选项
      searchInput: '',
      filterList: [],
      btnDisabled: true,

      /**
         *  input 状态 方法
         */

      // 填写资料
      profile: {
        classesid: 0,
        name: '',
        title: '',
        gender: '',
        genderText: '',
        avatar: '',
        className: '',
        relation: ''
      },
      file: null,
      showClassesSelect: false,
      showRelationSelect: false,
      showGenderSelect: false,
      levelNames: [ '学前', '小学', '初中', '高中' ],
      classesSelectValues: [],
      // 关系选择器
      relationSelectValues: [ '家长', '爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '叔叔', '阿姨', '舅舅', '姑姑' ],
      genderSelectValues: [ '男', '女' ]
    };
  },
  computed: {
    canPost() {
      const canPost = this.profile.classesid > 0 && this.profile.name && this.profile.title && this.profile.gender;
      return canPost;
    }
  },
  methods: {
    onPageShow() {
      this.school = this.Page.Param.school || {};
      this.getClassesList();
    },
    getClassesList() {
      this.Api.get('/school/view/classes/list', {
        schoolid: this.school.id
      }).on('success', json => {
        const classes = json.data.classes || [];
        this.classesList = classes;
        const levels = Array.from(new Set(classes.map(node => {
          return this.getLevelName(node.level);
        })));
        const grades = this.findGrades(levels[0]);
        const levelSelect = {
          values: levels,
          className: 'column1',
          defaultIndex: 0
        };
        const gradeSelect = {
          values: grades,
          className: 'column2',
          defaultIndex: 0
        };
        const classesSelect = {
          values: this.findClasses(levels[0], grades[0]),
          className: 'column3',
          defaultIndex: 0
        };
        this.classesSelectValues = [ levelSelect, gradeSelect, classesSelect ];
      });
    },
    /**
       * 状态通用方法
       */

    // 下一步方法
    getAvatar() {
      if (!this.file) {
        return Promise.resolve('');
      }
      const uploader = this.Api.upload('/common/storage/avatar', this.file).promisify.then(json => {
        return json.data.url;
      });
      return uploader;
    },
    clickNextBtn() {
      this.getAvatar().then(avatar => {
        this.profile.avatar = avatar;
        this.Api.post('/user/identity/registry/student', this.profile).on('success', json => {
          if (json.data.registered) {
            this.Toast.show('当前学生信息已注册，监护人手机尾号：' + json.data.mobile + '，请联系监护人邀请添加。');
            return false;
          }
          if (json.data.posted) {
            this.Toast.show('当前学生信息已提交，正在审核中，您可主动联系老师加快审核。');
            return false;
          }
          this.Toast.show('学生信息提交成功，请耐心等待审核通过');
          this.Page.back(true);
        });
      });
    },
    clickBackBtn() {
      this.Page.back(true);
    },

    openClassesSelect() {
      setTimeout(() => {
        this.showClassesSelect = true;
      }, 50);
    },
    openRelationSelect() {
      setTimeout(() => {
        this.showRelationSelect = true;
      }, 50);
    },
    openGenderSelect() {
      setTimeout(() => {
        this.showGenderSelect = true;
      }, 50);
    },
    /**
       * 班级选择器不同列之间的联动方法 方法内调用细节请参考 Vant Picker 官方文档
       * @method onChange
       * @param {Object} picker picker 选择器实例
       * @param {Array} values 对应列的值
       * @param {Int} index 当前对应列
       */
    onChange(picker, values, index) {
      if (index <= 1) {
        picker.setColumnValues(1, this.findGrades(values[0]));
        picker.setColumnValues(2, this.findClasses(values[0], values[1]));
      }
    },
    getLevelName(level) {
      return this.levelNames[level];
    },
    getRealLevel(name) {
      return this.levelNames.indexOf(name);
    },
    findGrades(level = '') {
      level = this.getRealLevel(level);
      const classes = this.classesList.filter(node => {
        return node.level == level;
      });
      const grades = Array.from(new Set(classes.map(node => {
        return node.grade + '级';
      })));
      return grades;
    },
    findClasses(level = '', grade = '') {
      level = this.getRealLevel(level);
      let classes = this.classesList.filter(node => {
        return node.level == level && node.grade + '级' == grade;
      });
      classes = Array.from(new Set(classes.map(node => {
        return node.name;
      })));
      return classes;
    },
    findClassesid(selected = []) {
      const [ levelName, grade, classesName ] = selected;
      const level = this.getRealLevel(levelName);
      const classes = this.classesList.find(node => {
        return node.level == level && node.grade + '级' == grade && node.name == classesName;
      });
      return classes ? classes.id : 0;
    },
    onClassesConfirm(value) {
      this.profile.className = value.join(' ');
      this.showClassesSelect = false;
      this.profile.classesid = this.findClassesid(value);
    },
    onRelationSelectConfirm(value) {
      this.profile.title = value;
      this.profile.relation = value;
      this.showRelationSelect = false;
    },
    onGenderSelectConfirm(value) {
      const genders = ['', '男', '女'];
      this.profile.gender = genders.indexOf(value);
      this.profile.genderText = value;
      this.showGenderSelect = false;
    },
    getImage(e) { // 图片读取
      this.file = e.target.files[0];
      if (!e || !window.FileReader) return; // 是否支持 FileReader
      const reader = new FileReader();
      reader.readAsDataURL(this.file); // 图片转换为 base64
      reader.onloadend = () => {
        this.profile.avatarPreview = this.result;
      };
    },
    searchSchool() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.Api.get('/school/search', {
          open_join: 1,
          name: this.searchInput
        }).on('success', (json, response) => {
          this.alternative = json.data.schools;
          this.filterList = this.alternative;
          for (const k in this.filterList) {
            if (this.filterList[k].name == this.searchInput) {
              this.btnDisabled = false;
            }
          }
        });
      }, 300);
    }

  },
  watch: {
    // 监听输入框变化，动态修改备选学校列表
    searchInput(newVal, oldVal) {
      this.btnDisabled = true;
      this.searchSchool(this.searchInput);
    }
  }
};
</script>
