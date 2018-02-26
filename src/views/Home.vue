<template>
    <my-page title="SQL 工具">
        <textarea id="text" class="form-control" v-model="text" rows="16" placeholder="输入 SQL"></textarea>
        <div class="btns">
            <ui-raised-button class="btn" label="格式化" primary @click="format" />
            <ui-raised-button class="btn" label="压缩" @click="compress" />
            <ui-raised-button class="btn btn-copy" label="复制" />
            <ui-raised-button class="btn" label="来个测试用例" @click="showCase" />
            <ui-raised-button class="btn" label="清空结果" @click="clear" />
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                text: ''
            }
        },
        mounted() {
            this.clipboard = new Clipboard('.btn-copy', {
                text: trigger => {
                    return this.text
                }
            });
            this.clipboard.on('success', function(e) {
                console.info('Action:', e.action);
                console.info('Text:', e.text);
                console.info('Trigger:', e.trigger);

                e.clearSelection();
            });

            this.clipboard.on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        },
        destoryed() {
            this.clipboard.destroy()
        },
        methods: {
            format() {
                $('#text').format({method: 'sql'})
            },
            compress() {
                $('#text').format({method: 'sqlmin'})
            },
            showCase() {
                this.text = `DELETE FROM table1 WHERE NOT EXISTS (SELECT * FROM table2 WHERE table1.field1=table2.field1);`
            },
            clear() {
                this.text = ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-control {
        margin-bottom: 16px;
    }
    .form-control:focus {
        border-color: #009688;
        outline: 0;
    }
    textarea.form-control {
        height: auto;
    }
    .form-control {
        display: block;
        width: 100%;
        height: 33px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42;
        color: #55595c;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 2px;
    }
    .btns {
        .btn {
            margin-right: 8px;
        }
    }
</style>
