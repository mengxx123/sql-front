<template>
    <my-page title="数据库文档4">
        <section class="index-box">
            <h2 class="title">目录</h2>
            <ul class="index-list">
                <li class="item" v-for="table in tables">
                    <a :href="'#table-' + table.name">
                        {{ table.name }}
                        <span v-if="table.comment">（{{ table.comment }}）</span>
                    </a>
                </li>
            </ul>
        </section>
        <ul class="table-list">
            <li class="item" :id="'table-' + table.name" v-for="table in tables">
                <table>
                    <tr>
                        <td class="table-name" colspan="5">
                            {{ table.name }}
                            <span v-if="table.comment">（{{ table.comment }}）</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="column-name">列名</th>
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
                        <td>{{ formatedDataType(row.dataType) }}</td>
                        <td>{{ row.notNull ? '否' : '是' }}</td>
                        <td>{{ defaultValue(row) }}</td>
                        <td>{{ row.comment }}</td>
                    </tr>
                </table>
            </li>
        </ul>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                tables: []
            }
        },
        mounted() {
            this.$http.get(location.origin + '/static/table.json').then(
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
        methods: {
            defaultValue(row) {
                if (row.default && row.dataType.indexOf('int') !== -1) {
//                    return row.default
                    return row.default.substring(1, row.default.length - 1) // 去掉引号
                }
                return row.default === '' ? "''" : row.default
            },
            formatedDataType(dataType) {
                return dataType.replace(/,/, ', ')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table-list {
        .item {
            padding-top: 16px;
            margin-bottom: 24px;
        }
    }
    table {
        width: 100%;
        max-width: 960px;
        th {
            background-color: #e9e9e9;
        }
        th,
        td {
            padding: 8px 16px;
            border: 1px solid #ccc;
        }
        .table-name {
            font-weight: bold;
            /*text-align: center;*/
        }
        .column-name {
            width: 160px;
        }
        .column-data-type {
            width: 160px;
        }
        .column-null {
            width: 96px;
        }
        .column-default {
            width: 240px;
        }
    }
    .badge {
        margin-left: 8px;
    }
    .pk {
        display: inline-block;
        margin-left: 8px;
    }
    .index-box {
        display: inline-block;
        max-width: 800px;
        padding: 16px;
        background-color: #fff;
        box-shadow: 0 3px 10px rgba(0,0,0,.156863), 0 3px 10px rgba(0,0,0,.227451);
        .title {
            margin-bottom: 16px;
            font-size: 16px;
        }
    }
    @media all and (min-width: 1400px) {
        .index-box {
            position: fixed;
            top: 80px;
            right: 32px;
            z-index: 1000;
        }
    }
</style>
