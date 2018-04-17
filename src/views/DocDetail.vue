<template>
    <my-page title="数据库文档" :page="page">
        <div class="inline-category-box">
            <div class="index-box">
                <div class="search-box">
                    <input class="input" v-model="keyword" placeholder="输入名称、分类快速搜索工具">
                    <ui-icon-button icon="close" title="清空" @click="keyword = ''" v-if="keyword.length" />
                </div>
                <div class="index-list-box">
                    <div class="empty" v-if="!filtedTables.length">没有搜索结果~</div>
                    <ul class="index-list">
                        <li class="item" v-for="table in filtedTables">
                            <a class="link" :href="'#table-' + table.name">
                                {{ table.name }}
                                <span v-if="table.comment">（{{ table.comment }}）</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="table-box">
            <ul class="table-list">
                <li class="item" :id="'table-' + table.name" v-for="table in tables">
                    <table>
                        <tr>
                            <td class="table-name" colspan="6">
                                {{ table.name }}
                                <span v-if="table.comment">（{{ table.comment }}）</span>
                            </td>
                        </tr>
                        <tr>
                            <th class="column-name">列名</th>
                            <th class="column-name2">中文名</th>
                            <th class="column-data-type">数据类型</th>
                            <th class="column-null">允许为空</th>
                            <th class="column-default">默认值</th>
                            <th class="column-comment">注释</th>
                        </tr>
                        <tr v-for="row in table.rows">
                            <td>
                                {{ row.columnName }}
                                <!--<ui-badge class="badge" content="主键" v-if="row.primaryKey" />-->
                                <img src="/static/img/key.png" class="pk" v-if="row.primaryKey" title="主键"/>
                                <ui-badge class="badge" content="外键" v-if="row.foreignKey" />
                                <ui-badge class="badge" content="自增" v-if="row.autoIncrement" />
                            </td>
                            <td>
                                {{ row.columnNameZh }}
                            </td>
                            <td>{{ formatedDataType(row.dataType) }}</td>
                            <td>{{ row.notNull ? '否' : '是' }}</td>
                            <td>{{ defaultValue(row) }}</td>
                            <td>{{ row.comment }}</td>
                        </tr>
                    </table>
                </li>
            </ul>
        </div>
        <ui-drawer class="category-box" right :open="open" :docked="true" @close="toggle()">
            <ui-appbar title="目录">
                <ui-icon-button icon="close" @click="toggle" slot="left" />
            </ui-appbar>
            <div class="body">
                <div class="index-box">
                    <div class="search-box">
                        <input class="input" v-model="keyword" placeholder="输入名称、分类快速搜索工具">
                    </div>
                    <div class="index-list-box">
                        <ul class="index-list">
                            <li class="item" v-for="table in filtedTables">
                                <a class="link" :href="'#table-' + table.name">
                                    {{ table.name }}
                                    <span v-if="table.comment">（{{ table.comment }}）</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                keyword: '',
                tables: [],
                open: false,
                page: {
                    menu: []
                }
            }
        },
        mounted() {
            let url = this.$route.query.url
            if (url) {
                this.loadUrl(url)
            }
            this.debug()
            window.addEventListener('resize', this.onResize = () => {
                this.resize()
            }, false)
        },
        computed: {
            filtedTables() {
                if (!this.keyword) {
                    return this.tables
                }
                let arr = []
                for (let table of this.tables) {
                    if (table.name.includes(this.keyword) || table.comment.includes(this.keyword)) {
                        arr.push(table)
                    }
                }
                return arr
            }
        },
        destroyed() {
            window.removeEventListener('resize', this.onResize)
        },
        methods: {
            resize() {
                if (window.innerWidth < 800) {
                    this.page.menu = [
                        {
                            type: 'icon',
                            icon: 'list',
                            click: this.toggle,
                            title: '目录'
                        }
                    ]
                } else {
                    this.page.menu = []
                }
            },
            debug() {
//                let url = location.origin + '/static/table2.json'
                let url = 'http://localhost:9999/wsdgy/database/1.0.1/table.json'
                this.loadUrl(url)
            },
            loadUrl(url) {
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.tables = data
                        for (let table of this.tables) {
                            table.id = '' + new Date().getTime()
                        }
                    },
                    response => {
                        console.log(response)
                    })
            },
            defaultValue(row) {
                if (row.default && row.dataType.indexOf('int') !== -1) {
//                    return row.default
                    return row.default.substring(1, row.default.length - 1) // 去掉引号
                }
                return row.default === '' ? "''" : row.default
            },
            formatedDataType(dataType) {
                return dataType.replace(/,/, ', ')
            },
            toggle() {
                this.open = !this.open
            }
        },
        watch: {
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/doc";
</style>
