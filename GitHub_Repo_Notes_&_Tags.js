// ==UserScript==
// @name         GitHub Repo Notes & Tags
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07
// @homepageURL  https://github.com/Startanuki07
// @license      MIT
// @author       Star_tanuki07
// @version      1.2.0.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @description  Add personal notes, tags, and ratings to repos on your GitHub lists.
// @description:zh-TW 為 GitHub 清單中的 repo 加上個人備註、分類標籤與星等評分。
// @description:zh-CN 为 GitHub 列表中的 repo 添加个人备注、分类标签与星级评分。
// @description:ja    GitHub のリスト内のリポジトリに、個人メモ・タグ・評価を追加します。
// @description:ko    GitHub 목록의 저장소에 개인 메모, 태그, 별점을 추가합니다.
// @name:zh-TW   GitHub Repo 備註與標籤
// @name:zh-CN   GitHub Repo 备注与标签
// @name:ja      GitHub リポジトリのメモとタグ
// @name:ko      GitHub 저장소 메모 및 태그
// @match        https://github.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const I18N_STRINGS = {
        en: {
            'modal.cancel': 'Cancel',
            'modal.reset': 'Reset',
            'modal.confirm': 'Confirm',
            'modal.delete': 'Delete',
            'saved.reloadHint': 'Saved — reload the page to apply to the current list',
            'saved.reload': 'Reload',
            'category.none': 'Category',
            'category.edit': 'Edit category',
            'category.delete': 'Delete category',
            'category.add': 'Add category',
            'category.new': 'New category',
            'category.namePlaceholder': 'e.g. "WIP", "Archived"...',
            'category.color': 'Category color',
            'category.saveChanges': 'Save changes',
            'category.pickOrManage': 'Pick a category, or manage groups below',
            'category.shiftDeleteTip': 'Tip: Shift+Click ✕ to delete without confirming',
            'category.noCategory': 'No category',
            'group.namePlaceholder': 'New group name...',
            'group.add': 'Add group',
            'group.new': 'New group',
            'group.deleteTip': 'Delete group (Shift+Click to skip confirmation)',
            'group.deleteConfirmTitle': 'Delete group "{label}"?',
            'group.deleteConfirmBodyWithCats': 'This group has {n} categor{y}. Deleting it removes {those} too, and any repo already tagged with {one} will keep showing the old label as plain text (the pill just won\u2019t resolve a color/name anymore) instead of resetting to None. This can\u2019t be undone.',
            'group.deleteConfirmBodyEmpty': 'This group has no categories in it yet. This can\u2019t be undone.',
            'panel.tab.standard': 'Standard',
            'panel.tab.other': 'Other',
            'panel.displaySettings': 'Display Settings',
            'panel.resetToDefault': 'Reset to default',
            'panel.noteSize': 'Note size',
            'panel.editIconAlwaysVisible': 'Edit icon always visible',
            'panel.remarkBeforeVisibility': 'Remark before Public/Private label',
            'panel.enableRatingStars': 'Enable rating stars',
            'panel.reloadAfterChange': 'Reload the page after changing this.',
            'panel.reloadAfterChanges': 'Reload the page after changing these.',
            'panel.pageSupport': 'Page Support',
            'panel.pageStarred': 'Starred repos',
            'panel.pageRepositories': 'Your repositories',
            'panel.pageOrgRepos': 'Organization repositories',
            'panel.pillStyle': 'Pill Style',
            'panel.pillGlow': 'Pill glow',
            'panel.pillCorners': 'Pill corners',
            'panel.pillSpacing': 'Pill spacing',
            'panel.pillSize': 'Pill size',
            'panel.releaseIconGlow': 'Release icon glow',
            'panel.enableReleaseIconGlow': 'Enable release icon glow',
            'panel.releaseIconPickerHint': 'Release icon picker \u2192 left panel.',
            'panel.releaseIconThisRepo': 'Release Icon (this repo)',
            'panel.lockedIconAllRepos': 'Locked icon (shown for every repo)',
            'panel.lockTitleLocked': 'Locked \u2014 every repo shows the locked icon. Click to unlock.',
            'panel.lockTitleUnlocked': 'Lock the release icon for every repo',
            'panel.locked': 'Locked',
            'panel.unlocked': 'Unlocked',
            'panel.viewReleases': 'View releases',
            'stats.title': 'Stats',
            'stats.noneYet': 'No repos noted yet.',
            'stats.notedCount': '{n} repo{s} noted',
            'backup.title': 'Backup',
            'backup.export': 'Export',
            'backup.import': 'Import',
            'backup.neverExported': 'Never exported \u2014 consider backing up your notes.',
            'backup.lastExported': 'Last exported: {date}',
            'backup.notValidJson': 'Not valid JSON.',
            'backup.notValidBackup': 'Not a valid backup file.',
            'backup.missingData': 'Missing expected data \u2014 this doesn\u2019t look like a backup from this script.',
            'backup.replaceConfirmTitle': 'Replace all current data?',
            'backup.replaceConfirmBody': 'This will replace everything currently saved ({n} repo note{s}, custom categories, display settings, and panel scale) with the contents of this file, then reload the page. This can\u2019t be undone unless you have another backup.',
            'reset.title': 'Reset',
            'reset.everything': 'Reset everything to defaults',
            'reset.confirmTitle': 'Reset everything to defaults?',
            'reset.confirmBody': 'This clears every repo note, every custom category, and all display settings (including the release-icon lock) back to how this script looked on first install, then reloads the page. Export a backup first if you\u2019re not sure \u2014 this can\u2019t be undone.',
            'remark.editName': 'Edit display name',
            'remark.editNote': 'Edit note',
            'remark.notePlaceholder': 'Note...',
            'remark.noteTextColor': 'Note text color',
            'remark.manageTemplates': 'Manage category templates',
            'remark.rateStars': 'Rate {n} star{s}',
            'language.title': 'Language',
            'language.current': 'Current language',
            'language.export': 'Export Template',
            'language.import': 'Import Translation',
            'language.exportHint': 'Export a template to translate, or import one you\u2019ve already translated.',
            'language.notValidJson': 'Not valid JSON.',
            'language.notValidFile': 'Not a valid language file.',
            'language.missingNameOrCode': 'Missing "langName" or "langCode" \u2014 fill those in before importing.',
            'language.importSuccess': 'Imported "{name}" \u2014 select it above to switch.',
            'language.importError': 'Could not import \u2014 {error}',
            'language.deleteCustom': 'Delete this custom language',
            'language.deleteConfirmTitle': 'Delete language "{name}"?',
            'language.deleteConfirmBody': 'This removes the imported translation. Switches back to English. This can\u2019t be undone (unless you re-import the file).',
        },
        'zh-TW': {
            'modal.cancel': '取消',
            'modal.reset': '重設',
            'modal.confirm': '確認',
            'modal.delete': '刪除',
            'saved.reloadHint': '已儲存 — 重新整理頁面以套用到目前清單',
            'saved.reload': '重新整理',
            'category.none': '分類',
            'category.edit': '編輯分類',
            'category.delete': '刪除分類',
            'category.add': '新增分類',
            'category.new': '新分類',
            'category.namePlaceholder': '例如「WIP」、「封存」...',
            'category.color': '分類顏色',
            'category.saveChanges': '儲存變更',
            'category.pickOrManage': '選擇分類，或在下方管理群組',
            'category.shiftDeleteTip': '提示：Shift+點擊 ✕ 可跳過確認直接刪除',
            'category.noCategory': '無分類',
            'group.namePlaceholder': '新群組名稱...',
            'group.add': '新增群組',
            'group.new': '新群組',
            'group.deleteTip': '刪除群組（Shift+點擊可跳過確認）',
            'group.deleteConfirmTitle': '刪除群組「{label}」？',
            'group.deleteConfirmBodyWithCats': '此群組內有 {n} 個分類。刪除後會一併移除{those}，任何已標記{one}的 repo 將只顯示純文字舊標籤（無法再對應顏色／名稱），而不會重設為「無」。此動作無法復原。',
            'group.deleteConfirmBodyEmpty': '此群組內尚無任何分類。此動作無法復原。',
            'panel.tab.standard': '標準',
            'panel.tab.other': '其他',
            'panel.displaySettings': '顯示設定',
            'panel.resetToDefault': '重設為預設值',
            'panel.noteSize': '備註文字大小',
            'panel.editIconAlwaysVisible': '編輯圖示常駐顯示',
            'panel.remarkBeforeVisibility': '備註顯示於 Public/Private 標籤之前',
            'panel.enableRatingStars': '啟用星等評分',
            'panel.reloadAfterChange': '變更此項後請重新整理頁面。',
            'panel.reloadAfterChanges': '變更這些項目後請重新整理頁面。',
            'panel.pageSupport': '頁面支援',
            'panel.pageStarred': 'Starred 清單',
            'panel.pageRepositories': '我的 Repositories',
            'panel.pageOrgRepos': '組織 Repositories',
            'panel.pillStyle': '標籤樣式',
            'panel.pillGlow': '標籤光暈',
            'panel.pillCorners': '標籤圓角',
            'panel.pillSpacing': '標籤間距',
            'panel.pillSize': '標籤大小',
            'panel.releaseIconGlow': 'Release 圖示光暈',
            'panel.enableReleaseIconGlow': '啟用 Release 圖示光暈',
            'panel.releaseIconPickerHint': 'Release 圖示選擇器 → 左側面板。',
            'panel.releaseIconThisRepo': 'Release 圖示（此 repo）',
            'panel.lockedIconAllRepos': '鎖定圖示（套用至所有 repo）',
            'panel.lockTitleLocked': '已鎖定 — 所有 repo 皆顯示鎖定圖示。點擊以解鎖。',
            'panel.lockTitleUnlocked': '將 Release 圖示鎖定套用至所有 repo',
            'panel.locked': '已鎖定',
            'panel.unlocked': '未鎖定',
            'panel.viewReleases': '查看 Releases',
            'stats.title': '統計',
            'stats.noneYet': '尚無任何 repo 備註。',
            'stats.notedCount': '已備註 {n} 個 repo',
            'backup.title': '備份',
            'backup.export': '匯出',
            'backup.import': '匯入',
            'backup.neverExported': '尚未匯出過 — 建議備份您的備註資料。',
            'backup.lastExported': '上次匯出：{date}',
            'backup.notValidJson': '不是有效的 JSON 格式。',
            'backup.notValidBackup': '不是有效的備份檔案。',
            'backup.missingData': '缺少必要資料 — 這看起來不是本腳本產生的備份檔。',
            'backup.replaceConfirmTitle': '取代目前所有資料？',
            'backup.replaceConfirmBody': '這會將目前已儲存的所有內容（{n} 筆 repo 備註、自訂分類、顯示設定與面板縮放比例）取代為此檔案的內容，並重新整理頁面。除非您另有備份，否則此動作無法復原。',
            'reset.title': '重設',
            'reset.everything': '將所有設定重設為預設值',
            'reset.confirmTitle': '將所有設定重設為預設值？',
            'reset.confirmBody': '這會清除所有 repo 備註、所有自訂分類，以及全部顯示設定（含 Release 圖示鎖定），恢復成腳本初次安裝時的狀態，並重新整理頁面。若不確定，請先匯出備份 — 此動作無法復原。',
            'remark.editName': '編輯顯示名稱',
            'remark.editNote': '編輯備註',
            'remark.notePlaceholder': '備註...',
            'remark.noteTextColor': '備註文字顏色',
            'remark.manageTemplates': '管理分類範本',
            'remark.rateStars': '評為 {n} 顆星',
            'language.title': '語言',
            'language.current': '目前語言',
            'language.export': '匯出範本',
            'language.import': '匯入翻譯',
            'language.exportHint': '匯出範本自行翻譯，或匯入已翻譯好的檔案。',
            'language.notValidJson': '不是有效的 JSON 格式。',
            'language.notValidFile': '不是有效的語言檔案。',
            'language.missingNameOrCode': '缺少「langName」或「langCode」— 請先填寫後再匯入。',
            'language.importSuccess': '已匯入「{name}」— 於上方選擇即可切換。',
            'language.importError': '匯入失敗 — {error}',
            'language.deleteCustom': '刪除此自訂語言',
            'language.deleteConfirmTitle': '刪除語言「{name}」？',
            'language.deleteConfirmBody': '這會移除已匯入的翻譯，並切換回英文。此動作無法復原（除非重新匯入檔案）。',
        },
        'zh-CN': {
            'modal.cancel': '取消',
            'modal.reset': '重置',
            'modal.confirm': '确认',
            'modal.delete': '删除',
            'saved.reloadHint': '已保存 — 刷新页面以应用到当前列表',
            'saved.reload': '刷新',
            'category.none': '分类',
            'category.edit': '编辑分类',
            'category.delete': '删除分类',
            'category.add': '添加分类',
            'category.new': '新分类',
            'category.namePlaceholder': '例如"WIP"、"已归档"...',
            'category.color': '分类颜色',
            'category.saveChanges': '保存更改',
            'category.pickOrManage': '选择分类，或在下方管理分组',
            'category.shiftDeleteTip': '提示：Shift+点击 ✕ 可跳过确认直接删除',
            'category.noCategory': '无分类',
            'group.namePlaceholder': '新分组名称...',
            'group.add': '添加分组',
            'group.new': '新分组',
            'group.deleteTip': '删除分组（Shift+点击可跳过确认）',
            'group.deleteConfirmTitle': '删除分组"{label}"？',
            'group.deleteConfirmBodyWithCats': '此分组内有 {n} 个分类。删除后会一并移除{those}，任何已标记{one}的仓库将只显示纯文本旧标签（无法再对应颜色/名称），而不会重置为"无"。此操作无法撤销。',
            'group.deleteConfirmBodyEmpty': '此分组内尚无任何分类。此操作无法撤销。',
            'panel.tab.standard': '标准',
            'panel.tab.other': '其他',
            'panel.displaySettings': '显示设置',
            'panel.resetToDefault': '重置为默认值',
            'panel.noteSize': '备注文字大小',
            'panel.editIconAlwaysVisible': '编辑图标常驻显示',
            'panel.remarkBeforeVisibility': '备注显示于 Public/Private 标签之前',
            'panel.enableRatingStars': '启用星级评分',
            'panel.reloadAfterChange': '更改此项后请刷新页面。',
            'panel.reloadAfterChanges': '更改这些项目后请刷新页面。',
            'panel.pageSupport': '页面支持',
            'panel.pageStarred': 'Starred 列表',
            'panel.pageRepositories': '我的 Repositories',
            'panel.pageOrgRepos': '组织 Repositories',
            'panel.pillStyle': '标签样式',
            'panel.pillGlow': '标签光晕',
            'panel.pillCorners': '标签圆角',
            'panel.pillSpacing': '标签间距',
            'panel.pillSize': '标签大小',
            'panel.releaseIconGlow': 'Release 图标光晕',
            'panel.enableReleaseIconGlow': '启用 Release 图标光晕',
            'panel.releaseIconPickerHint': 'Release 图标选择器 → 左侧面板。',
            'panel.releaseIconThisRepo': 'Release 图标（此仓库）',
            'panel.lockedIconAllRepos': '锁定图标（应用于所有仓库）',
            'panel.lockTitleLocked': '已锁定 — 所有仓库均显示锁定图标。点击以解锁。',
            'panel.lockTitleUnlocked': '将 Release 图标锁定应用于所有仓库',
            'panel.locked': '已锁定',
            'panel.unlocked': '未锁定',
            'panel.viewReleases': '查看 Releases',
            'stats.title': '统计',
            'stats.noneYet': '尚无任何仓库备注。',
            'stats.notedCount': '已备注 {n} 个仓库',
            'backup.title': '备份',
            'backup.export': '导出',
            'backup.import': '导入',
            'backup.neverExported': '尚未导出过 — 建议备份您的备注数据。',
            'backup.lastExported': '上次导出：{date}',
            'backup.notValidJson': '不是有效的 JSON 格式。',
            'backup.notValidBackup': '不是有效的备份文件。',
            'backup.missingData': '缺少必要数据 — 这看起来不是本脚本生成的备份文件。',
            'backup.replaceConfirmTitle': '替换当前所有数据？',
            'backup.replaceConfirmBody': '这会将当前已保存的所有内容（{n} 条仓库备注、自定义分类、显示设置与面板缩放比例）替换为此文件的内容，并刷新页面。除非您另有备份，否则此操作无法撤销。',
            'reset.title': '重置',
            'reset.everything': '将所有设置重置为默认值',
            'reset.confirmTitle': '将所有设置重置为默认值？',
            'reset.confirmBody': '这会清除所有仓库备注、所有自定义分类，以及全部显示设置（含 Release 图标锁定），恢复为脚本初次安装时的状态，并刷新页面。若不确定，请先导出备份 — 此操作无法撤销。',
            'remark.editName': '编辑显示名称',
            'remark.editNote': '编辑备注',
            'remark.notePlaceholder': '备注...',
            'remark.noteTextColor': '备注文字颜色',
            'remark.manageTemplates': '管理分类模板',
            'remark.rateStars': '评为 {n} 星',
            'language.title': '语言',
            'language.current': '当前语言',
            'language.export': '导出模板',
            'language.import': '导入翻译',
            'language.exportHint': '导出模板自行翻译，或导入已翻译好的文件。',
            'language.notValidJson': '不是有效的 JSON 格式。',
            'language.notValidFile': '不是有效的语言文件。',
            'language.missingNameOrCode': '缺少"langName"或"langCode" — 请先填写后再导入。',
            'language.importSuccess': '已导入"{name}" — 在上方选择即可切换。',
            'language.importError': '导入失败 — {error}',
            'language.deleteCustom': '删除此自定义语言',
            'language.deleteConfirmTitle': '删除语言"{name}"？',
            'language.deleteConfirmBody': '这会移除已导入的翻译，并切换回英文。此操作无法撤销（除非重新导入文件）。',
        },
        ja: {
            'modal.cancel': 'キャンセル',
            'modal.reset': 'リセット',
            'modal.confirm': '確認',
            'modal.delete': '削除',
            'saved.reloadHint': '保存しました — ページを再読み込みすると現在のリストに反映されます',
            'saved.reload': '再読み込み',
            'category.none': 'カテゴリ',
            'category.edit': 'カテゴリを編集',
            'category.delete': 'カテゴリを削除',
            'category.add': 'カテゴリを追加',
            'category.new': '新しいカテゴリ',
            'category.namePlaceholder': '例：「WIP」「アーカイブ」など',
            'category.color': 'カテゴリの色',
            'category.saveChanges': '変更を保存',
            'category.pickOrManage': 'カテゴリを選択するか、下でグループを管理してください',
            'category.shiftDeleteTip': 'ヒント：Shift+クリックで ✕ すると確認なしで削除できます',
            'category.noCategory': 'カテゴリなし',
            'group.namePlaceholder': '新しいグループ名...',
            'group.add': 'グループを追加',
            'group.new': '新しいグループ',
            'group.deleteTip': 'グループを削除（Shift+クリックで確認をスキップ）',
            'group.deleteConfirmTitle': 'グループ「{label}」を削除しますか？',
            'group.deleteConfirmBodyWithCats': 'このグループには {n} 件のカテゴリがあります。削除すると{those}も削除され、{one}が設定されていたリポジトリはピルが色/名前を解決できなくなり、プレーンテキストの古いラベルとして表示されます（「なし」にはリセットされません）。この操作は元に戻せません。',
            'group.deleteConfirmBodyEmpty': 'このグループにはまだカテゴリがありません。この操作は元に戻せません。',
            'panel.tab.standard': '標準',
            'panel.tab.other': 'その他',
            'panel.displaySettings': '表示設定',
            'panel.resetToDefault': 'デフォルトに戻す',
            'panel.noteSize': 'メモの文字サイズ',
            'panel.editIconAlwaysVisible': '編集アイコンを常時表示',
            'panel.remarkBeforeVisibility': 'メモを Public/Private ラベルの前に表示',
            'panel.enableRatingStars': '星評価を有効にする',
            'panel.reloadAfterChange': 'この設定を変更した後はページを再読み込みしてください。',
            'panel.reloadAfterChanges': 'これらの設定を変更した後はページを再読み込みしてください。',
            'panel.pageSupport': '対応ページ',
            'panel.pageStarred': 'スター付きリポジトリ',
            'panel.pageRepositories': '自分のリポジトリ',
            'panel.pageOrgRepos': '組織のリポジトリ',
            'panel.pillStyle': 'ピルのスタイル',
            'panel.pillGlow': 'ピルの発光',
            'panel.pillCorners': 'ピルの角丸',
            'panel.pillSpacing': 'ピルの間隔',
            'panel.pillSize': 'ピルのサイズ',
            'panel.releaseIconGlow': 'リリースアイコンの発光',
            'panel.enableReleaseIconGlow': 'リリースアイコンの発光を有効にする',
            'panel.releaseIconPickerHint': 'リリースアイコン選択 → 左側パネル。',
            'panel.releaseIconThisRepo': 'リリースアイコン（このリポジトリ）',
            'panel.lockedIconAllRepos': '固定アイコン（全リポジトリに表示）',
            'panel.lockTitleLocked': '固定中 — すべてのリポジトリで固定アイコンを表示しています。クリックで解除。',
            'panel.lockTitleUnlocked': 'リリースアイコンを全リポジトリに固定する',
            'panel.locked': '固定中',
            'panel.unlocked': '未固定',
            'panel.viewReleases': 'リリースを表示',
            'stats.title': '統計',
            'stats.noneYet': 'まだメモされたリポジトリはありません。',
            'stats.notedCount': '{n} 件のリポジトリにメモ済み',
            'backup.title': 'バックアップ',
            'backup.export': 'エクスポート',
            'backup.import': 'インポート',
            'backup.neverExported': 'まだエクスポートしていません — メモのバックアップをおすすめします。',
            'backup.lastExported': '前回のエクスポート：{date}',
            'backup.notValidJson': '有効な JSON ではありません。',
            'backup.notValidBackup': '有効なバックアップファイルではありません。',
            'backup.missingData': '必要なデータが不足しています — このスクリプトのバックアップではないようです。',
            'backup.replaceConfirmTitle': '現在のすべてのデータを置き換えますか？',
            'backup.replaceConfirmBody': '現在保存されているすべての内容（{n} 件のリポジトリメモ、カスタムカテゴリ、表示設定、パネルの拡大率）をこのファイルの内容に置き換え、ページを再読み込みします。別のバックアップがない限り、この操作は元に戻せません。',
            'reset.title': 'リセット',
            'reset.everything': 'すべてをデフォルトにリセット',
            'reset.confirmTitle': 'すべてをデフォルトにリセットしますか？',
            'reset.confirmBody': 'すべてのリポジトリメモ、すべてのカスタムカテゴリ、および表示設定（リリースアイコンの固定を含む）が、スクリプトを最初にインストールしたときの状態に戻り、ページが再読み込みされます。不安な場合は先にバックアップをエクスポートしてください — この操作は元に戻せません。',
            'remark.editName': '表示名を編集',
            'remark.editNote': 'メモを編集',
            'remark.notePlaceholder': 'メモ...',
            'remark.noteTextColor': 'メモの文字色',
            'remark.manageTemplates': 'カテゴリテンプレートを管理',
            'remark.rateStars': '{n} つ星で評価',
            'language.title': '言語',
            'language.current': '現在の言語',
            'language.export': 'テンプレートをエクスポート',
            'language.import': '翻訳をインポート',
            'language.exportHint': 'テンプレートをエクスポートして翻訳するか、翻訳済みのファイルをインポートしてください。',
            'language.notValidJson': '有効な JSON ではありません。',
            'language.notValidFile': '有効な言語ファイルではありません。',
            'language.missingNameOrCode': '「langName」または「langCode」が未入力です — インポート前に入力してください。',
            'language.importSuccess': '「{name}」をインポートしました — 上で選択すると切り替わります。',
            'language.importError': 'インポートできませんでした — {error}',
            'language.deleteCustom': 'このカスタム言語を削除',
            'language.deleteConfirmTitle': '言語「{name}」を削除しますか？',
            'language.deleteConfirmBody': 'インポートした翻訳が削除され、英語に戻ります。この操作は元に戻せません（ファイルを再インポートすれば可能です）。',
        },
        ko: {
            'modal.cancel': '취소',
            'modal.reset': '초기화',
            'modal.confirm': '확인',
            'modal.delete': '삭제',
            'saved.reloadHint': '저장됨 — 페이지를 새로고침하면 현재 목록에 적용됩니다',
            'saved.reload': '새로고침',
            'category.none': '카테고리',
            'category.edit': '카테고리 편집',
            'category.delete': '카테고리 삭제',
            'category.add': '카테고리 추가',
            'category.new': '새 카테고리',
            'category.namePlaceholder': '예: "WIP", "보관됨"...',
            'category.color': '카테고리 색상',
            'category.saveChanges': '변경 사항 저장',
            'category.pickOrManage': '카테고리를 선택하거나 아래에서 그룹을 관리하세요',
            'category.shiftDeleteTip': '팁: Shift+클릭으로 ✕ 하면 확인 없이 삭제됩니다',
            'category.noCategory': '카테고리 없음',
            'group.namePlaceholder': '새 그룹 이름...',
            'group.add': '그룹 추가',
            'group.new': '새 그룹',
            'group.deleteTip': '그룹 삭제 (Shift+클릭으로 확인 건너뛰기)',
            'group.deleteConfirmTitle': '그룹 "{label}"을(를) 삭제하시겠습니까?',
            'group.deleteConfirmBodyWithCats': '이 그룹에는 {n}개의 카테고리가 있습니다. 삭제하면 {those}도 함께 제거되며, {one}로 태그된 저장소는 색상/이름을 더 이상 표시하지 못하고 일반 텍스트 라벨로만 표시됩니다(없음으로 재설정되지 않음). 이 작업은 되돌릴 수 없습니다.',
            'group.deleteConfirmBodyEmpty': '이 그룹에는 아직 카테고리가 없습니다. 이 작업은 되돌릴 수 없습니다.',
            'panel.tab.standard': '표준',
            'panel.tab.other': '기타',
            'panel.displaySettings': '표시 설정',
            'panel.resetToDefault': '기본값으로 재설정',
            'panel.noteSize': '메모 글자 크기',
            'panel.editIconAlwaysVisible': '편집 아이콘 항상 표시',
            'panel.remarkBeforeVisibility': 'Public/Private 라벨 앞에 메모 표시',
            'panel.enableRatingStars': '별점 평가 사용',
            'panel.reloadAfterChange': '이 항목을 변경한 후 페이지를 새로고침하세요.',
            'panel.reloadAfterChanges': '이 항목들을 변경한 후 페이지를 새로고침하세요.',
            'panel.pageSupport': '지원 페이지',
            'panel.pageStarred': 'Starred 저장소',
            'panel.pageRepositories': '내 저장소',
            'panel.pageOrgRepos': '조직 저장소',
            'panel.pillStyle': '태그 스타일',
            'panel.pillGlow': '태그 광택',
            'panel.pillCorners': '태그 모서리',
            'panel.pillSpacing': '태그 간격',
            'panel.pillSize': '태그 크기',
            'panel.releaseIconGlow': 'Release 아이콘 광택',
            'panel.enableReleaseIconGlow': 'Release 아이콘 광택 사용',
            'panel.releaseIconPickerHint': 'Release 아이콘 선택 → 왼쪽 패널.',
            'panel.releaseIconThisRepo': 'Release 아이콘 (이 저장소)',
            'panel.lockedIconAllRepos': '고정 아이콘 (모든 저장소에 표시)',
            'panel.lockTitleLocked': '고정됨 — 모든 저장소에 고정 아이콘이 표시됩니다. 클릭하여 해제.',
            'panel.lockTitleUnlocked': 'Release 아이콘을 모든 저장소에 고정',
            'panel.locked': '고정됨',
            'panel.unlocked': '고정 안 됨',
            'panel.viewReleases': 'Releases 보기',
            'stats.title': '통계',
            'stats.noneYet': '아직 메모된 저장소가 없습니다.',
            'stats.notedCount': '저장소 {n}개에 메모함',
            'backup.title': '백업',
            'backup.export': '내보내기',
            'backup.import': '가져오기',
            'backup.neverExported': '아직 내보낸 적이 없습니다 — 메모를 백업하는 것을 권장합니다.',
            'backup.lastExported': '마지막 내보내기: {date}',
            'backup.notValidJson': '유효한 JSON이 아닙니다.',
            'backup.notValidBackup': '유효한 백업 파일이 아닙니다.',
            'backup.missingData': '필요한 데이터가 없습니다 — 이 스크립트의 백업 파일이 아닌 것 같습니다.',
            'backup.replaceConfirmTitle': '현재 모든 데이터를 교체하시겠습니까?',
            'backup.replaceConfirmBody': '현재 저장된 모든 내용({n}개의 저장소 메모, 사용자 지정 카테고리, 표시 설정, 패널 배율)을 이 파일의 내용으로 교체하고 페이지를 새로고침합니다. 다른 백업이 없다면 이 작업은 되돌릴 수 없습니다.',
            'reset.title': '초기화',
            'reset.everything': '모든 설정을 기본값으로 초기화',
            'reset.confirmTitle': '모든 설정을 기본값으로 초기화하시겠습니까?',
            'reset.confirmBody': '모든 저장소 메모, 모든 사용자 지정 카테고리, 그리고 모든 표시 설정(Release 아이콘 고정 포함)이 스크립트를 처음 설치했을 때 상태로 초기화되고 페이지가 새로고침됩니다. 확실하지 않다면 먼저 백업을 내보내세요 — 이 작업은 되돌릴 수 없습니다.',
            'remark.editName': '표시 이름 편집',
            'remark.editNote': '메모 편집',
            'remark.notePlaceholder': '메모...',
            'remark.noteTextColor': '메모 글자 색상',
            'remark.manageTemplates': '카테고리 템플릿 관리',
            'remark.rateStars': '별 {n}개로 평가',
            'language.title': '언어',
            'language.current': '현재 언어',
            'language.export': '템플릿 내보내기',
            'language.import': '번역 가져오기',
            'language.exportHint': '템플릿을 내보내 번역하거나, 번역된 파일을 가져오세요.',
            'language.notValidJson': '유효한 JSON이 아닙니다.',
            'language.notValidFile': '유효한 언어 파일이 아닙니다.',
            'language.missingNameOrCode': '"langName" 또는 "langCode"가 없습니다 — 가져오기 전에 입력해 주세요.',
            'language.importSuccess': '"{name}"을(를) 가져왔습니다 — 위에서 선택하면 전환됩니다.',
            'language.importError': '가져오지 못했습니다 — {error}',
            'language.deleteCustom': '이 사용자 지정 언어 삭제',
            'language.deleteConfirmTitle': '언어 "{name}"을(를) 삭제하시겠습니까?',
            'language.deleteConfirmBody': '가져온 번역이 제거되고 영어로 돌아갑니다. 이 작업은 되돌릴 수 없습니다(파일을 다시 가져오면 복구 가능).',
        },
    };

    const BUILTIN_LANGUAGES = {
        en: { name: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
        'zh-TW': { name: '繁體中文', flag: '\u{1F1F9}\u{1F1FC}' },
        'zh-CN': { name: '简体中文', flag: '\u{1F1E8}\u{1F1F3}' },
        ja: { name: '日本語', flag: '\u{1F1EF}\u{1F1F5}' },
        ko: { name: '한국어', flag: '\u{1F1F0}\u{1F1F7}' },
    };

    const LANGUAGE_STORAGE_KEY = 'GRNT-language';

    let _languageCache = null;
    const LanguageStorage = {
        get() {
            if (_languageCache === null) {
                const stored = GM_getValue(LANGUAGE_STORAGE_KEY, null);
                _languageCache = (stored && typeof stored === 'object')
                    ? { current: stored.current || 'en', custom: stored.custom || {} }
                    : { current: 'en', custom: {} };
            }
            return _languageCache;
        },
        setCurrent(code) {
            const state = LanguageStorage.get();
            state.current = code;
            GM_setValue(LANGUAGE_STORAGE_KEY, state);
        },
        addCustom(code, name, strings) {
            const state = LanguageStorage.get();
            state.custom[code] = { name, strings };
            GM_setValue(LANGUAGE_STORAGE_KEY, state);
        },
        removeCustom(code) {
            const state = LanguageStorage.get();
            delete state.custom[code];
            if (state.current === code) state.current = 'en';
            GM_setValue(LANGUAGE_STORAGE_KEY, state);
        },
    };

    function resolveActiveStrings() {
        const { current, custom } = LanguageStorage.get();
        if (BUILTIN_LANGUAGES[current]) {
            return Object.assign({}, I18N_STRINGS.en, I18N_STRINGS[current] || {});
        }
        if (custom[current]) {
            return Object.assign({}, I18N_STRINGS.en, custom[current].strings || {});
        }
        return Object.assign({}, I18N_STRINGS.en);
    }

    function t(key, vars) {
        const strings = resolveActiveStrings();
        let str = strings[key] !== undefined ? strings[key] : key;
        if (vars) {
            for (const k in vars) {
                str = str.split('{' + k + '}').join(vars[k]);
            }
        }
        return str;
    }

    const REMARK_STYLES = `
        .gh-remark-badge {
            font-size: 12px;
            margin-left: 10px;
            vertical-align: middle;
            display: inline-flex;
            align-items: center;
            line-height: 1;
            
            min-width: 16px;
            min-height: 14px;
        }

        .gh-remark-cat-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-right: var(--gh-remark-pill-gap, 4px);
            padding: calc(1px * var(--gh-remark-pill-scale, 1)) calc(8px * var(--gh-remark-pill-scale, 1)) calc(1px * var(--gh-remark-pill-scale, 1)) calc(6px * var(--gh-remark-pill-scale, 1));
            border-radius: var(--gh-remark-pill-radius, 10px);
            font-size: calc(10.2px * var(--gh-remark-pill-scale, 1));
            font-weight: 600;
            letter-spacing: .2px;
            color: var(--cat-color, #e3b341);
            background: linear-gradient(180deg, #1c1c1c, #0a0a0a);
            border: 1px solid var(--cat-color, #e3b341);
            box-shadow: 0 0 var(--gh-remark-pill-glow, 4px) var(--cat-color, #e3b341);
        }
        .gh-remark-cat-pill-dot {
            width: calc(6px * var(--gh-remark-pill-scale, 1));
            height: calc(6px * var(--gh-remark-pill-scale, 1));
            border-radius: 50%;
            background: var(--cat-color, #e3b341);
            flex: none;
        }
        
        .gh-remark-cat-pill-label {
            display: inline-block;
            max-width: 8em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
        }

        .gh-remark-badge-sep {
            margin-right: 4px;
            color: var(--fgColor-muted, #6e7681);
            opacity: 0.6;
        }
        
        .gh-remark-badge-text {
            display: inline-block;
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            margin-right: 4px;
            font-size: var(--gh-remark-text-size, 12px);
            color: var(--remark-color, #e3b341);
        }
        .gh-remark-badge-edit {
            margin-left: 3px;
        }
        .gh-remark-badge-edit svg {
            fill: var(--fgColor-muted, #9198a1);
            opacity: 0.5;
            transition: opacity 0.15s ease;
            cursor: pointer;
        }
        .gh-remark-badge-edit:hover svg {
            opacity: 1;
        }
        
        .gh-remark-edit-hover-only .gh-remark-badge:not(:hover) .gh-remark-badge-edit {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }
        .gh-remark-edit-hover-only .gh-remark-heading:hover .gh-remark-badge-edit {
            opacity: 0.5;
            width: auto;
            overflow: visible;
        }
        
        .gh-remark-release-icon {
            transition: opacity .2s ease;
        }
        .gh-remark-heading:hover .gh-remark-release-icon {
            opacity: 1;
        }
        .gh-remark-release-icon.gh-remark-icon-hop {
            animation: gh-remark-icon-hop .45s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes gh-remark-icon-hop {
            0%   { transform: scale(1) rotate(0deg); }
            35%  { transform: scale(1.22) rotate(-12deg); }
            60%  { transform: scale(1.08) rotate(8deg); }
            80%  { transform: scale(1.1) rotate(-4deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
        
        .gh-remark-release-icon.gh-remark-icon-breathe {
            animation: gh-remark-icon-breathe 1.8s ease-in-out 2;
        }
        @keyframes gh-remark-icon-breathe {
            0%, 100% { transform: scale(1); opacity: .55; }
            50%      { transform: scale(1.08); opacity: 1; }
        }
        
        .gh-remark-release-icon.gh-remark-icon-bounce {
            animation: gh-remark-icon-bounce .55s cubic-bezier(.28,.84,.42,1);
        }
        @keyframes gh-remark-icon-bounce {
            0%   { transform: translateY(0) scale(1); }
            30%  { transform: translateY(-9px) scale(1.05,.95); }
            50%  { transform: translateY(0) scale(.94,1.08); }
            68%  { transform: translateY(-4px) scale(1.02,.98); }
            84%  { transform: translateY(0) scale(.98,1.02); }
            100% { transform: translateY(0) scale(1); }
        }
        
        .gh-remark-release-icon.gh-remark-icon-spinpop {
            animation: gh-remark-icon-spinpop .5s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes gh-remark-icon-spinpop {
            0%   { transform: rotate(0deg) scale(1); }
            55%  { transform: rotate(340deg) scale(1.2); }
            75%  { transform: rotate(360deg) scale(.92); }
            100% { transform: rotate(360deg) scale(1); }
        }
        .gh-remark-release-icon:active {
            transition-duration: .08s;
            transform: scale(.92);
        }
        .gh-remark-badge-input {
            background-color: var(--bgColor-default, #0d1117);
            color: var(--fgColor-default, #f0f6fc);
            border: 1px solid var(--borderColor-default, #3d444d);
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 12px;
            margin-right: 4px;
            outline: none;
        }
        .gh-remark-badge-input:focus {
            border-color: var(--fgColor-accent, #4493f8);
        }
        .gh-remark-badge-input::placeholder {
            color: var(--fgColor-muted, #9198a1);
            opacity: 0.7;
        }
        .gh-remark-badge-input:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .gh-remark-badge-color-swatch {
            width: 22px;
            height: 22px;
            padding: 0;
            border: 1px solid var(--borderColor-default, #3d444d);
            border-radius: 4px;
            background: none;
            cursor: pointer;
            vertical-align: middle;
        }

        .gh-remark-cat-select {
            position: relative;
            display: inline-block;
            margin-right: 4px;
        }
        
        .gh-remark-cat-select-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background-color: var(--bgColor-default, #0d1117);
            color: var(--fgColor-default, #f0f6fc);
            border: 1px solid var(--borderColor-default, #3d444d);
            border-radius: var(--gh-remark-pill-radius, 6px);
            padding: calc(2px * var(--gh-remark-pill-scale, 1)) calc(8px * var(--gh-remark-pill-scale, 1));
            font-size: calc(12px * var(--gh-remark-pill-scale, 1));
            cursor: pointer;
            width: calc(92px * var(--gh-remark-pill-scale, 1));
            box-shadow: 0 0 var(--gh-remark-pill-glow, 0) var(--borderColor-default, #3d444d);
        }
        .gh-remark-cat-select-btn:hover,
        .gh-remark-cat-select.open .gh-remark-cat-select-btn {
            border-color: var(--fgColor-accent, #4493f8);
        }
        .gh-remark-cat-select-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        .gh-remark-cat-select-btn:disabled:hover {
            border-color: var(--borderColor-default, #3d444d);
        }
        .gh-remark-cat-select-btn .gh-remark-cat-select-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
        }
        .gh-remark-cat-select-list {
            
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            width: calc(420px * var(--gh-remark-panel-scale, 1));
            max-height: calc(340px * var(--gh-remark-panel-scale, 1));
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            background-color: var(--bgColor-default, #0d1117);
            border: 1px solid var(--borderColor-default, #3d444d);
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 100;
            padding: calc(8px * var(--gh-remark-panel-scale, 1));
            opacity: 0;
            visibility: hidden;
            transform: translateY(-4px);
            transition: opacity 0.15s ease, transform 0.15s ease,
                        visibility 0s linear 0.15s;
        }
        .gh-remark-cat-select.open .gh-remark-cat-select-list {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        
        .gh-remark-cat-select.align-right .gh-remark-cat-select-list {
            left: auto;
            right: 0;
        }
        
        .gh-remark-cat-tab-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            padding-bottom: 6px;
            margin-bottom: 6px;
            border-bottom: 1px solid var(--borderColor-default, #3d444d);
            flex: none;
        }
        .gh-remark-cat-tab-btn {
            position: relative;
            flex: none;
            border: 1px solid var(--borderColor-default, #3d444d);
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            border-radius: 12px;
            padding: calc(3px * var(--gh-remark-panel-scale, 1)) calc(22px * var(--gh-remark-panel-scale, 1)) calc(3px * var(--gh-remark-panel-scale, 1)) calc(10px * var(--gh-remark-panel-scale, 1));
            font-size: calc(11px * var(--gh-remark-panel-scale, 1));
            cursor: pointer;
            white-space: nowrap;
            
            max-width: 8em;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .gh-remark-cat-tab-btn:hover {
            color: var(--fgColor-default, #f0f6fc);
        }
        .gh-remark-cat-tab-btn--active {
            border-color: #e3b341;
            color: #e3b341;
            background-color: rgba(227,179,65,0.1);
        }
        
        .gh-remark-cat-tab-btn--add {
            padding: calc(3px * var(--gh-remark-panel-scale, 1)) calc(10px * var(--gh-remark-panel-scale, 1));
            font-weight: 700;
        }
        
        .gh-remark-cat-tab-del {
            display: none;
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            width: calc(12px * var(--gh-remark-panel-scale, 1));
            height: calc(12px * var(--gh-remark-panel-scale, 1));
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            font-size: calc(9px * var(--gh-remark-panel-scale, 1));
            line-height: 1;
            padding: 0;
            cursor: pointer;
        }
        .gh-remark-cat-tab-btn:hover .gh-remark-cat-tab-del {
            display: inline-flex;
        }
        .gh-remark-cat-tab-del:hover {
            color: #f85149;
        }
        
        .gh-remark-cat-select-grid {
            position: relative;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(calc(90px * var(--gh-remark-panel-scale, 1)), 1fr));
            gap: calc(4px * var(--gh-remark-panel-scale, 1));
            
            padding-top: calc(16px * var(--gh-remark-panel-scale, 1));
            margin-top: calc(-16px * var(--gh-remark-panel-scale, 1));
        }
        
        .gh-remark-cat-option {
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: calc(5px * var(--gh-remark-panel-scale, 1));
            
            padding: calc(5px * var(--gh-remark-panel-scale, 1)) calc(30px * var(--gh-remark-panel-scale, 1)) calc(5px * var(--gh-remark-panel-scale, 1)) calc(6px * var(--gh-remark-panel-scale, 1));
            border-radius: 4px;
            font-size: calc(11px * var(--gh-remark-panel-scale, 1));
            line-height: 1.25;
            color: var(--fgColor-default, #f0f6fc);
            cursor: pointer;
            
            white-space: nowrap;
        }
        .gh-remark-cat-option:hover {
            background-color: var(--bgColor-muted, #151b23);
        }
        .gh-remark-cat-option-dot {
            width: calc(8px * var(--gh-remark-panel-scale, 1));
            height: calc(8px * var(--gh-remark-panel-scale, 1));
            border-radius: 50%;
            flex: none;
        }
        
        .gh-remark-cat-option-label {
            flex: 1;
            min-width: 0;
            max-width: 5.5em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .gh-remark-cat-option-edit {
            display: none;
            position: absolute;
            top: 50%;
            right: 18px;
            transform: translateY(-50%);
            width: calc(12px * var(--gh-remark-panel-scale, 1));
            height: calc(12px * var(--gh-remark-panel-scale, 1));
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            font-size: calc(9px * var(--gh-remark-panel-scale, 1));
            line-height: 1;
            padding: 0;
            cursor: pointer;
            opacity: 0.7;
        }
        .gh-remark-cat-option:hover .gh-remark-cat-option-edit {
            display: inline-flex;
        }
        .gh-remark-cat-option-edit:hover {
            opacity: 1;
        }
        
        .gh-remark-cat-option-del {
            display: none;
            position: absolute;
            top: 50%;
            right: 4px;
            transform: translateY(-50%);
            width: calc(12px * var(--gh-remark-panel-scale, 1));
            height: calc(12px * var(--gh-remark-panel-scale, 1));
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            font-size: calc(9px * var(--gh-remark-panel-scale, 1));
            line-height: 1;
            padding: 0;
            cursor: pointer;
        }
        .gh-remark-cat-option:hover .gh-remark-cat-option-del {
            display: inline-flex;
        }
        .gh-remark-cat-option-del:hover {
            color: #f85149;
        }
        
        .gh-remark-cat-add-tile {
            position: absolute;
            top: calc(-4px * var(--gh-remark-panel-scale, 1));
            right: calc(-4px * var(--gh-remark-panel-scale, 1));
            width: calc(18px * var(--gh-remark-panel-scale, 1));
            height: calc(18px * var(--gh-remark-panel-scale, 1));
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e3b341;
            border-radius: 50%;
            background: #0d1117;
            color: #e3b341;
            font-size: calc(9px * var(--gh-remark-panel-scale, 1));
            line-height: 1;
            padding: 0;
            cursor: pointer;
        }
        .gh-remark-cat-add-tile:hover {
            background-color: rgba(227,179,65,0.15);
        }

        .gh-remark-cat-select-hint {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
            color: var(--fgColor-muted, #9198a1);
            font-style: italic;
            font-size: calc(11px * var(--gh-remark-panel-scale, 1));
            border-bottom: 1px solid var(--borderColor-default, #3d444d);
            margin-bottom: 6px;
            padding-bottom: calc(8px * var(--gh-remark-panel-scale, 1));
        }
        
        .gh-remark-cat-select-hint-text {
            display: block;
            min-width: 0;
        }
        
        .gh-remark-panel-scale-btn {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            flex: none;
            border: 1px solid var(--borderColor-default, #3d444d);
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            border-radius: 4px;
            padding: calc(2px * var(--gh-remark-panel-scale, 1)) calc(5px * var(--gh-remark-panel-scale, 1));
            font-size: calc(9px * var(--gh-remark-panel-scale, 1));
            font-style: normal;
            font-weight: 600;
            line-height: 1.4;
            cursor: pointer;
        }
        .gh-remark-panel-scale-btn:hover {
            color: var(--fgColor-default, #f0f6fc);
            border-color: var(--fgColor-accent, #4493f8);
        }
        .gh-remark-panel-scale-btn svg {
            width: calc(12px * var(--gh-remark-panel-scale, 1));
            height: calc(12px * var(--gh-remark-panel-scale, 1));
            fill: none;
            stroke: currentColor;
            stroke-width: 1.6;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        
        .gh-remark-cat-select-hint-tip {
            display: block;
            font-style: normal;
            opacity: 0.7;
        }
        
        .gh-remark-cat-option-none-tile {
            color: var(--fgColor-muted, #9198a1);
            font-style: italic;
        }

        .gh-remark-gear-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 4px;
            border: none;
            background: transparent;
            opacity: 0.5;
            cursor: pointer;
            transition: opacity 0.15s ease, transform 0.2s ease;
            font-size: 13px;
            line-height: 1;
        }
        .gh-remark-gear-btn:hover {
            opacity: 1;
            transform: rotate(25deg);
        }

        .gh-remark-cat-panel {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            width: 300px;
            
            height: 420px;
            overflow-y: auto;
            background: linear-gradient(180deg, #1c1c1c, #0a0a0a);
            border: 1px solid #e3b341;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            z-index: 101;
            padding: 10px;
            font-size: 12px;
            color: #f0f6fc;
            opacity: 1;
            transform: scale(1) translateY(0);
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        
        .gh-remark-cat-panel.gh-remark-panel-entering,
        .gh-remark-icon-side-panel.gh-remark-panel-entering {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
        }
        .gh-remark-cat-panel.gh-remark-panel-closing,
        .gh-remark-icon-side-panel.gh-remark-panel-closing {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
        }
        .gh-remark-tab-bar {
            display: flex;
            gap: 4px;
            margin-bottom: 10px;
            border-bottom: 1px solid #3d444d;
            padding-bottom: 8px;
        }
        .gh-remark-tab-btn {
            flex: 1;
            border: 1px solid #3d444d;
            background: transparent;
            color: #9198a1;
            border-radius: 6px;
            padding: 4px 6px;
            font-size: 11px;
            cursor: pointer;
        }
        .gh-remark-tab-btn:hover {
            color: #f0f6fc;
        }
        .gh-remark-tab-btn--active {
            border-color: #e3b341;
            color: #e3b341;
            background-color: rgba(227,179,65,0.1);
        }
        .gh-remark-tab-content {
            position: relative;
        }
        
        .gh-remark-saved-msg {
            position: fixed;
            font-size: 11px;
            color: #e3b341;
            opacity: 1;
            transform: translateY(-50%);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
            z-index: 1000;
        }
        .gh-remark-saved-msg--fade {
            opacity: 0;
            transform: translateY(calc(-50% - 6px));
        }
        
        .gh-remark-reload-toast {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translate(-50%, 0);
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 14px;
            background: #21262d;
            border: 1px solid #3d444d;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            font-size: 12px;
            color: #e6edf3;
            opacity: 1;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: auto;
            z-index: 1001;
        }
        .gh-remark-reload-toast--fade {
            opacity: 0;
            transform: translate(-50%, -8px);
        }
        .gh-remark-reload-toast-btn {
            border: 1px solid #58a6ff;
            border-radius: 6px;
            background: rgba(88,166,255,0.15);
            color: #58a6ff;
            font-size: 12px;
            padding: 3px 10px;
            cursor: pointer;
            white-space: nowrap;
        }
        .gh-remark-reload-toast-btn:hover {
            background: rgba(88,166,255,0.28);
        }
        .gh-remark-cat-panel-title {
            font-weight: 600;
            color: #e3b341;
            margin-bottom: 8px;
            font-size: 12px;
            letter-spacing: .3px;
        }
        
        .gh-remark-cat-panel-title--section {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #3d444d;
        }
        .gh-remark-cat-panel-title--section::before {
            content: '▸ ';
            opacity: 0.7;
        }
        .gh-remark-cat-panel-row {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 3px 0;
        }
        .gh-remark-cat-panel-row .gh-remark-cat-option-dot {
            flex: none;
        }
        .gh-remark-cat-panel-row-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .gh-remark-cat-panel-checkbox {
            width: 14px;
            height: 14px;
            accent-color: #e3b341;
            cursor: pointer;
            flex: none;
            
            transition: transform 0.1s ease;
        }
        .gh-remark-cat-panel-checkbox:active {
            transform: scale(0.85);
        }
        .gh-remark-cat-panel-del {
            border: none;
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            cursor: pointer;
            font-size: 13px;
            line-height: 1;
            padding: 2px 4px;
        }
        .gh-remark-cat-panel-del:hover {
            color: #f85149;
        }
        
        .gh-remark-cat-panel-slider {
            accent-color: #e3b341;
            cursor: pointer;
            transition: filter 0.1s ease;
        }
        .gh-remark-cat-panel-slider:active {
            filter: brightness(1.2);
        }
        
        .gh-remark-reset-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            padding: 0;
            border: none;
            background: transparent;
            color: var(--fgColor-muted, #9198a1);
            opacity: 0.45;
            cursor: pointer;
            flex: none;
            transition: opacity 0.15s ease;
        }
        .gh-remark-reset-btn svg {
            width: 12px;
            height: 12px;
        }
        .gh-remark-reset-btn:hover {
            opacity: 1;
            color: #e3b341;
        }
        
        .gh-remark-badge-color-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
        }
        .gh-remark-badge-color-wrap .gh-remark-reset-btn {
            position: absolute;
            right: -4px;
            top: -4px;
            background: #0d1117;
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
        }
        .gh-remark-badge-color-wrap:hover .gh-remark-reset-btn {
            opacity: 1;
            pointer-events: auto;
        }
        .gh-remark-cat-panel-empty {
            color: var(--fgColor-muted, #9198a1);
            font-style: italic;
            padding: 4px 0;
        }

        .gh-remark-cat-inline-form-title {
            grid-column: 1 / -1;
            color: #e3b341;
            font-size: calc(11px * var(--gh-remark-panel-scale, 1));
            font-weight: 600;
            margin-bottom: calc(2px * var(--gh-remark-panel-scale, 1));
        }
        
        .gh-remark-cat-inline-form {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: calc(4px * var(--gh-remark-panel-scale, 1)) 0;
            width: 100%;
        }
        .gh-remark-cat-inline-form input[type="text"] {
            flex: 1;
            min-width: 0;
            background-color: #0d1117;
            color: #f0f6fc;
            border: 1px solid #3d444d;
            border-radius: 6px;
            padding: calc(3px * var(--gh-remark-panel-scale, 1)) calc(6px * var(--gh-remark-panel-scale, 1));
            font-size: calc(12px * var(--gh-remark-panel-scale, 1));
        }
        .gh-remark-cat-inline-form input[type="color"] {
            width: calc(26px * var(--gh-remark-panel-scale, 1));
            height: calc(26px * var(--gh-remark-panel-scale, 1));
            padding: 0;
            border: 1px solid #3d444d;
            border-radius: 6px;
            background: none;
            cursor: pointer;
        }
        .gh-remark-cat-inline-form button {
            flex: none;
            border: 1px solid #e3b341;
            background: transparent;
            color: #e3b341;
            border-radius: 6px;
            padding: 0 calc(8px * var(--gh-remark-panel-scale, 1));
            height: calc(26px * var(--gh-remark-panel-scale, 1));
            cursor: pointer;
            font-size: calc(12px * var(--gh-remark-panel-scale, 1));
        }
        .gh-remark-cat-inline-form button:hover {
            background-color: rgba(227,179,65,0.15);
        }
        
        .gh-remark-cat-inline-form-cancel {
            border-color: #3d444d !important;
            color: var(--fgColor-muted, #9198a1) !important;
        }
        .gh-remark-cat-inline-form-cancel:hover {
            background-color: rgba(255,255,255,0.06) !important;
            color: #f0f6fc !important;
        }

        .gh-remark-confirm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gh-remark-confirm-box {
            width: 320px;
            max-width: calc(100vw - 32px);
            background: linear-gradient(180deg, #1c1c1c, #0a0a0a);
            border: 1px solid #d29922;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            padding: 16px;
            color: #f0f6fc;
            font-size: 13px;
        }
        .gh-remark-confirm-title {
            font-weight: 600;
            color: #d29922;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .gh-remark-confirm-body {
            color: #c9d1d9;
            line-height: 1.5;
            margin-bottom: 14px;
        }
        .gh-remark-confirm-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        .gh-remark-confirm-actions button {
            border-radius: 6px;
            padding: 5px 12px;
            cursor: pointer;
            font-size: 12px;
            border: 1px solid #3d444d;
            background: transparent;
            color: #f0f6fc;
        }
        .gh-remark-confirm-actions button:hover {
            background-color: rgba(255,255,255,0.08);
        }
        .gh-remark-confirm-actions button.gh-remark-confirm-primary {
            border-color: #d29922;
            color: #d29922;
        }
        .gh-remark-confirm-actions button.gh-remark-confirm-primary:hover {
            background-color: rgba(210,153,34,0.15);
        }
        
        .gh-remark-confirm-actions button.gh-remark-confirm-danger {
            border-color: #f85149;
            color: #f85149;
        }
        .gh-remark-confirm-actions button.gh-remark-confirm-danger:hover {
            background-color: rgba(248,81,73,0.15);
        }

        .gh-remark-other-section {
            margin-bottom: 16px;
        }
        .gh-remark-other-section:last-child {
            margin-bottom: 0;
        }
        
        .gh-remark-stat-row {
            display: grid;
            grid-template-columns: 80px 1fr 28px;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #c9d1d9;
            margin-bottom: 4px;
        }
        .gh-remark-stat-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .gh-remark-stat-bar-track {
            height: 6px;
            background: rgba(255,255,255,0.06);
            border-radius: 3px;
            overflow: hidden;
        }
        .gh-remark-stat-bar-fill {
            height: 100%;
            background: #e3b341;
            border-radius: 3px;
        }
        .gh-remark-stat-count {
            text-align: right;
            color: #9198a1;
        }
        .gh-remark-other-btn-row {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        .gh-remark-other-btn-row button {
            flex: 1;
            border: 1px solid #3d444d;
            background: transparent;
            color: #f0f6fc;
            border-radius: 6px;
            padding: 6px 8px;
            cursor: pointer;
            font-size: 11px;
        }
        .gh-remark-other-btn-row button:hover {
            border-color: #e3b341;
            background-color: rgba(227,179,65,0.1);
        }
        
        .gh-remark-other-btn-row button.gh-remark-other-btn-danger {
            border-color: #f85149;
            color: #f85149;
        }
        .gh-remark-other-btn-row button.gh-remark-other-btn-danger:hover {
            border-color: #f85149;
            background-color: rgba(248,81,73,0.1);
        }
        
        .gh-remark-other-hint {
            font-size: 11px;
            color: #9198a1;
            margin-top: 6px;
        }
        .gh-remark-other-hint--error {
            color: #f85149;
        }
        
        .gh-remark-lang-select {
            flex: 1;
            background: var(--bgColor-default, #0d1117);
            color: var(--fgColor-default, #f0f6fc);
            border: 1px solid var(--borderColor-default, #3d444d);
            border-radius: 6px;
            padding: 4px 6px;
            font-size: 11px;
        }
        .gh-remark-lang-select:hover {
            border-color: #e3b341;
        }
        
        .gh-remark-lang-delete-btn {
            flex: none;
            width: 22px;
            height: 22px;
            border: 1px solid var(--borderColor-default, #3d444d);
            background: transparent;
            color: #f85149;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            line-height: 1;
        }
        .gh-remark-lang-delete-btn:hover {
            border-color: #f85149;
            background-color: rgba(248,81,73,0.1);
        }

        .gh-remark-rating-row {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            margin-left: 12px;
            line-height: 1;
        }
        .gh-remark-rating-star {
            display: inline-flex;
            border: none;
            background: none;
            padding: 1px;
            margin-right: 1px;
            cursor: pointer;
            color: #e3b341;
            
            opacity: 0.35;
            transition: opacity 0.15s, transform 0.1s;
        }
        .gh-remark-rating-star:hover {
            opacity: 0.85;
        }
        
        .gh-remark-rating-star.filled {
            opacity: 1;
        }
        .gh-remark-rating-star svg {
            width: 13px;
            height: 13px;
        }
        
        @keyframes gh-remark-rating-pulse {
            0%   { transform: scale(1); }
            40%  { transform: scale(1.5); }
            100% { transform: scale(1); }
        }
        .gh-remark-rating-star.pulse {
            animation: gh-remark-rating-pulse 0.28s ease-out;
        }

        .gh-remark-cat-panel,
        .gh-remark-icon-picker-grid,
        .gh-remark-cat-select-list {
            scrollbar-width: thin;
            scrollbar-color: #e3b341 #1c1c1c;
        }
        .gh-remark-cat-panel::-webkit-scrollbar,
        .gh-remark-icon-picker-grid::-webkit-scrollbar,
        .gh-remark-cat-select-list::-webkit-scrollbar {
            width: 6px;
        }
        .gh-remark-cat-panel::-webkit-scrollbar-track,
        .gh-remark-icon-picker-grid::-webkit-scrollbar-track,
        .gh-remark-cat-select-list::-webkit-scrollbar-track {
            background: #1c1c1c;
        }
        .gh-remark-cat-panel::-webkit-scrollbar-thumb,
        .gh-remark-icon-picker-grid::-webkit-scrollbar-thumb,
        .gh-remark-cat-select-list::-webkit-scrollbar-thumb {
            background-color: #e3b341;
            border-radius: 3px;
        }

        .gh-remark-icon-picker-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding-right: 2px;
            opacity: 1;
            transition: opacity 0.15s ease;
        }
        
        .gh-remark-icon-picker-grid--leaving {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }
        .gh-remark-icon-picker-grid--entering {
            opacity: 0;
        }
        
        .gh-remark-icon-title-fade {
            transition: opacity 0.15s ease;
        }
        .gh-remark-icon-picker-header {
            grid-column: 1 / -1;
            font-size: 11px;
            font-weight: 600;
            color: #e3b341;
            opacity: 0.85;
            padding: 6px 0 2px;
            border-top: 1px solid #3d444d;
        }
        .gh-remark-icon-picker-grid .gh-remark-icon-picker-header:first-child {
            border-top: none;
            padding-top: 0;
        }
        .gh-remark-icon-picker-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            aspect-ratio: 1;
            padding: 0;
            border: 1px solid #3d444d;
            border-radius: 6px;
            background: linear-gradient(180deg, #1c1c1c, #0a0a0a);
            cursor: pointer;
            transition: border-color 0.15s ease, background-color 0.15s ease,
                        box-shadow 0.15s ease, transform 0.1s ease;
        }
        .gh-remark-icon-picker-btn svg {
            width: 16px;
            height: 16px;
        }
        .gh-remark-icon-picker-btn:hover {
            border-color: #e3b341;
        }
        .gh-remark-icon-picker-btn.selected {
            border-color: #e3b341;
            background: rgba(227,179,65,0.15);
            box-shadow: 0 0 4px -1px #e3b341;
        }
        
        .gh-remark-icon-picker-btn.gh-remark-press-pulse {
            transform: scale(0.88);
        }
        
        .gh-remark-icon-lock-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            padding: 0;
            border: 1px solid #3d444d;
            border-radius: 6px;
            background: none;
            color: #9198a1;
            cursor: pointer;
            margin-left: 6px;
        }
        .gh-remark-icon-lock-btn:hover {
            color: #f0f6fc;
            border-color: #e3b341;
        }
        .gh-remark-icon-lock-btn.locked {
            color: #e3b341;
            border-color: #e3b341;
            background: rgba(227,179,65,0.15);
            box-shadow: 0 0 6px -1px #e3b341;
        }
        .gh-remark-icon-lock-btn svg {
            width: 12px;
            height: 12px;
        }
        
        .gh-remark-icon-lock-status {
            font-size: 11px;
            line-height: 14px;
            min-height: 14px;
            color: #9198a1;
            transition: opacity 0.15s ease, color 0.15s ease;
        }
        
        .gh-remark-icon-lock-status.locked {
            color: #58a6ff;
            animation: gh-remark-lock-pulse 2.4s ease-in-out infinite;
        }
        @keyframes gh-remark-lock-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
        }
        
        .gh-remark-icon-side-panel {
            position: absolute;
            width: 300px;
            
            height: 420px;
            display: flex;
            flex-direction: column;
            background: linear-gradient(180deg, #1c1c1c, #0a0a0a);
            border: 1px solid #e3b341;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            padding: 10px;
            font-size: 12px;
            color: #f0f6fc;
            z-index: 101;
            opacity: 1;
            transform: scale(1) translateY(0);
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .gh-remark-icon-side-panel--below {
            
            height: auto;
        }

        .gh-remark-profile-name-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        
        .gh-remark-profile-name-wrap .gh-remark-profile-name-edit {
            opacity: 0;
            width: 0;
            overflow: hidden;
            flex: none;
            transition: opacity 0.15s ease;
        }
        .gh-remark-profile-name-wrap:hover .gh-remark-profile-name-edit {
            opacity: 0.5;
            width: auto;
            overflow: visible;
        }
        .gh-remark-profile-name-edit svg {
            fill: var(--fgColor-muted, #9198a1);
            cursor: pointer;
            vertical-align: middle;
        }
        .gh-remark-profile-name-edit:hover svg {
            fill: var(--fgColor-default, #f0f6fc);
        }
        
        .gh-remark-profile-name-input {
            font: inherit;
            color: inherit;
            background: transparent;
            border: none;
            border-bottom: 1px solid color-mix(in srgb, currentColor 60%, transparent);
            padding: 0;
            margin: 0;
            outline: none;
            width: 100%;
            min-width: 0;
        }
        .gh-remark-profile-name-input:focus {
            border-bottom-color: currentColor;
        }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = REMARK_STYLES;
    document.head.appendChild(styleTag);

    const EDIT_ICON_SVG =
        '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16">' +
        '<path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 ' +
        '010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 ' +
        '01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 ' +
        '0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 ' +
        '6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 ' +
        '0 00.108-.064l6.286-6.286z"></path></svg>';

    const GEAR_BUTTON_TEXT = '⚙️';

    const RESET_ICON_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M13.5 8A5.5 5.5 0 1 1 11.7 3.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path d="M13.5 3.5v3.2h-3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

    const LOCK_ICON_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect x="3.25" y="7" width="9.5" height="7" rx="1.4" stroke="currentColor" stroke-width="1.3"/>' +
        '<path d="M5.25 7V4.75a2.75 2.75 0 015.5 0V7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
        '</svg>';

    const TAG_ICON_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M8.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V8.5C1.5 8.77614 ' +
        '1.60536 9.03953 1.79289 9.22703L7.20711 14.6414C7.59763 15.0319 8.2308 ' +
        '15.0319 8.62132 14.6414L14.6414 8.62132C15.0319 8.2308 15.0319 7.59763 ' +
        '14.6414 7.20711L9.22703 1.79289C9.03953 1.60536 8.77614 1.5 8.5 1.5Z" ' +
        'stroke="currentColor" stroke-width="1.6"/>' +
        '<circle cx="5" cy="5" r="1.1" fill="currentColor"/>' +
        '</svg>';

    const STAR_ICON_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M8 1.5L9.85 5.75L14.5 6.19L11 9.27L12.03 13.83L8 11.48L' +
        '3.97 13.83L5 9.27L1.5 6.19L6.15 5.75L8 1.5Z" ' +
        'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
        '</svg>';

    const RATING_STAR_OUTLINE_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M8 1.5L9.85 5.75L14.5 6.19L11 9.27L12.03 13.83L8 11.48L' +
        '3.97 13.83L5 9.27L1.5 6.19L6.15 5.75L8 1.5Z" ' +
        'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
        '</svg>';
    const RATING_STAR_FILLED_SVG =
        '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M8 1.5L9.85 5.75L14.5 6.19L11 9.27L12.03 13.83L8 11.48L' +
        '3.97 13.83L5 9.27L1.5 6.19L6.15 5.75L8 1.5Z" ' +
        'stroke="none"/>' +
        '</svg>';

    const NONE_ICON_SVG =
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<circle cx="8" cy="8" r="2.2" fill="currentColor"/>' +
        '</svg>';

    const RELEASE_ICON_LIBRARY = [
        { div: '⭐ Original' },
        { id: 'none', label: 'None',  color: null, svg: NONE_ICON_SVG },
        { id: 'tag',  label: 'Tag',  color: null, svg: TAG_ICON_SVG },
        { id: 'star', label: 'Star', color: null, svg: STAR_ICON_SVG },
        { id: 'octocat', label: 'GitHub', color: '#e3b341', svg: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>' },
        { id: 'fork', label: 'Fork', color: '#7ee787', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="5" r="2.2"/><circle cx="17" cy="5" r="2.2"/><circle cx="12" cy="19" r="2.2"/><path d="M7 7.2v3a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-3M12 13.2V17"/></svg>' },
        { id: 'pullrequest', label: 'Pull Request', color: '#79c0ff', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><line x1="6" y1="8.2" x2="6" y2="15.8"/><path d="M6 6h6a4 4 0 0 1 4 4v1"/><circle cx="18" cy="16" r="2.2"/><polyline points="13.5 8.5 16 11 18.5 8.5"/></svg>' },
        { id: 'commit', label: 'Commit', color: '#d2a8ff', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="4"/></svg>' },
        { id: 'terminal', label: 'Terminal', color: '#3fb950', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 9l4 3-4 3"/><line x1="12" y1="15" x2="17" y2="15"/></svg>' },
        { id: 'codebrackets', label: 'Code', color: '#ff7b72', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 4 2 12 8 20"/><polyline points="16 4 22 12 16 20"/></svg>' },
        { id: 'database', label: 'Database', color: '#56d4dd', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>' },
        { id: 'package', label: 'Package', color: '#ffa657', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 7v10l10 5 10-5V7"/><path d="M12 12v10"/></svg>' },
        { id: 'bug', label: 'Bug', color: '#f85149', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="8" y="7" width="8" height="11" rx="4"/><path d="M12 3v4M9 5.5 7.5 4M15 5.5 16.5 4M4 12h4M16 12h4M5.5 18 8 16M18.5 18 16 16"/></svg>' },
        { id: 'securitylock', label: 'Lock', color: '#e3b341', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
        { id: 'cloud', label: 'Cloud', color: '#a5d6ff', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 19a4.5 4.5 0 0 1-.5-8.98A5.5 5.5 0 0 1 16.9 8.5 4.5 4.5 0 0 1 17.5 19h-11z"/></svg>' },
        { id: 'filepy', label: 'Python file', color: '#3572A5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><text x="12" y="18" font-size="6.5" font-family="monospace" text-anchor="middle" stroke="none" fill="currentColor">py</text></svg>' },
        { id: 'filejs', label: 'JavaScript file', color: '#f1c40f', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><text x="12" y="18" font-size="6" font-family="monospace" text-anchor="middle" stroke="none" fill="currentColor">js</text></svg>' },
        { id: 'filejava', label: 'Java file', color: '#e76f51', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><text x="12" y="17.5" font-size="5" font-family="monospace" text-anchor="middle" stroke="none" fill="currentColor">java</text></svg>' },
        { id: 'filegeneric', label: 'File', color: '#9198a1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="16.5" x2="13" y2="16.5"/></svg>' },

        { div: '📷 Media & Creation' },
        { id: 'photo',     label: 'Photo',     color: '#ffb74d', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13.5" r="3"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>' },
        { id: 'video',     label: 'Video',     color: '#ff8a65', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 8l5-3v14l-5-3V8z"/></svg>' },
        { id: 'music',     label: 'Music',     color: '#f48fb1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
        { id: 'art',       label: 'Art',       color: '#ce93d8', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4"/><circle cx="8.5" cy="9" r=".8" fill="currentColor"/><circle cx="15.5" cy="9" r=".8" fill="currentColor"/></svg>' },
        { id: 'palette',   label: 'Palette',   color: '#f06292', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 1.1 0 2-.9 2-2v-.5c0-.55-.22-1.05-.59-1.41-.36-.36-.59-.86-.59-1.41 0-1.1.9-2 2-2h2c3.31 0 6-2.69 6-6 0-4.97-4.48-8.58-9-8.59z"/><circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" stroke="none"/></svg>' },
        { id: 'film',      label: 'Film',      color: '#ef9a9a', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="17" y1="4" x2="17" y2="20"/><line x1="2" y1="9" x2="7" y2="9"/><line x1="17" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="7" y2="15"/><line x1="17" y1="15" x2="22" y2="15"/></svg>' },
        { id: 'mic',       label: 'Mic',       color: '#b39ddb', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>' },
        { id: 'headphone', label: 'Audio',     color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>' },
        { id: 'podcast',   label: 'Podcast',   color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="4" height="6"/><rect x="10" y="5" width="4" height="14"/><rect x="17" y="12" width="4" height="3"/><path d="M1 21h22"/></svg>' },
        { id: 'design',    label: 'Design',    color: '#f06292', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>' },
        { id: 'camera',    label: 'Camera',    color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h1.5l1.2-2h8.6l1.2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13.5" r="3.5"/></svg>' },

        { div: '🎮 Entertainment' },
        { id: 'game',   label: 'Game',   color: '#80cbc4', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M7 11v4M5 13h4"/><circle cx="16.5" cy="12" r=".8" fill="currentColor"/><circle cx="18.5" cy="14" r=".8" fill="currentColor"/></svg>' },
        { id: 'book',   label: 'Book',   color: '#ffcc80', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
        { id: 'fav',    label: 'Fav',    color: '#fff176', svg: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id: 'magic',  label: 'Magic',  color: '#b39ddb', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 6.2L11 5M12.2 11.8L11 13"/><path d="M3 21l9-9"/><circle cx="15" cy="9" r="3"/></svg>' },
        { id: 'puzzle', label: 'Puzzle', color: '#80deea', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M19 10h-1a2 2 0 1 1 0-4h1V4H4v6h1a2 2 0 1 1 0 4H4v6h15v-3a2 2 0 1 1 4 0v-7h-4z"/></svg>' },
        { id: 'coffee', label: 'Coffee', color: '#bcaaa4', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>' },
        { id: 'moon',   label: 'Night',  color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
        { id: 'gift',   label: 'Gift',   color: '#f48fb1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' },
        { id: 'dice',   label: 'Dice',   color: '#80deea', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><circle cx="6" cy="6" r=".8" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r=".8" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r=".8" fill="currentColor" stroke="none"/><circle cx="16" cy="20" r=".8" fill="currentColor" stroke="none"/></svg>' },
        { id: 'ticket', label: 'Ticket', color: '#ffd54f', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a2 2 0 0 0 0 4v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-4V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/><line x1="10" y1="6" x2="10" y2="18" stroke-dasharray="2 2"/></svg>' },
        { id: 'chess',  label: 'Chess',  color: '#b0bec5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M8 21v-3c0-1 .5-2 1-3l1-2-2-2 1-3h6l1 3-2 2 1 2c.5 1 1 2 1 3v3"/><circle cx="12" cy="5" r="2"/></svg>' },

        { div: '🌍 Travel & Lifestyle' },
        { id: 'travel',   label: 'Travel',   color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.5-8 13-8 13S4 15.5 4 10a8 8 0 0 1 8-8z"/></svg>' },
        { id: 'plane',    label: 'Plane',    color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16l-9-9-9 9"/><path d="M3 8l4.5 4.5L12 8l4.5 4.5L21 8"/><line x1="12" y1="3" x2="12" y2="8"/></svg>' },
        { id: 'globe',    label: 'Globe',    color: '#80deea', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
        { id: 'map',      label: 'Map',      color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
        { id: 'food',     label: 'Food',     color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><line x1="14" y1="2" x2="14" y2="8"/></svg>' },
        { id: 'fashion',  label: 'Fashion',  color: '#f8bbd0', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>' },
        { id: 'home',     label: 'Home',     color: '#ffb74d', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
        { id: 'mountain', label: 'Mountain', color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l4-13 4 13"/><path d="M3 21l6.5-16 2 5"/><path d="M22 21H2"/></svg>' },
        { id: 'tent',     label: 'Camping',  color: '#ffb74d', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 5v13H5V8z"/><path d="M12 3v9l5 3"/></svg>' },
        { id: 'car',      label: 'Car',      color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6"/><rect x="2" y="13" width="20" height="6" rx="1.5"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>' },
        { id: 'shopping', label: 'Shopping', color: '#f8bbd0', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },

        { div: '💪 Sport & Health' },
        { id: 'sport',      label: 'Sport',      color: '#ef9a9a', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93c2.34 2.34 3.07 5.71 2.07 8.71M19.07 4.93c-2.34 2.34-3.07 5.71-2.07 8.71M4.93 19.07c2.34-2.34 5.71-3.07 8.71-2.07M19.07 19.07c-2.34-2.34-5.71-3.07-8.71-2.07"/></svg>' },
        { id: 'run',        label: 'Run',        color: '#ffb74d', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M7 21l2-6 3 3 3-8 3 3"/><path d="M5 12l2-3 4 1 2-4"/></svg>' },
        { id: 'gym',        label: 'Gym',        color: '#ef9a9a', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="6.5" y1="12" x2="17.5" y2="12"/><rect x="2" y="9" width="4.5" height="6" rx="1.5"/><rect x="17.5" y="9" width="4.5" height="6" rx="1.5"/><line x1="6.5" y1="10.5" x2="6.5" y2="13.5"/><line x1="17.5" y1="10.5" x2="17.5" y2="13.5"/></svg>' },
        { id: 'bike',       label: 'Bike',       color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M8.5 17.5l3-8h5.5"/><path d="M15 9.5l3 8"/><circle cx="15" cy="5.5" r="1.5"/></svg>' },
        { id: 'health',     label: 'Health',     color: '#ef9a9a', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
        { id: 'pet',        label: 'Pet',        color: '#ffab91', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="14" r="6"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="4" cy="11" r="1.5"/><circle cx="20" cy="11" r="1.5"/></svg>' },
        { id: 'swim',       label: 'Swim',       color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><path d="M2 21c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><circle cx="17" cy="6" r="2.5"/><path d="M13.5 14L8 9 4 12"/></svg>' },
        { id: 'basketball', label: 'Basketball', color: '#ff8a65', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M5.5 5.5c2 2 4 2.5 6.5 2.5s4.5-.5 6.5-2.5M5.5 18.5c2-2 4-2.5 6.5-2.5s4.5.5 6.5 2.5"/></svg>' },
        { id: 'soccer',     label: 'Soccer',     color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8.2l2.7 2-1 3.2h-3.4l-1-3.2z" stroke-width="1.4"/><path d="M12 8.2V4.5M14.7 10.2l3.5-1.2M13.4 13.4l2.1 3.3M10.6 13.4l-2.1 3.3M9.3 10.2L5.8 9" stroke-width="1.4"/></svg>' },
        { id: 'yoga',       label: 'Yoga',       color: '#ce93d8', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.8"/><path d="M9 22l2-6h2l2 6"/><path d="M12 9v7"/><path d="M6 13c2-2 4-3 6-3s4 1 6 3"/></svg>' },

        { div: '💼 Work & Knowledge' },
        { id: 'work',     label: 'Work',     color: '#b0bec5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>' },
        { id: 'tech',     label: 'Tech',     color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
        { id: 'brain',    label: 'Brain',    color: '#ce93d8', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3a3 3 0 0 1 6 0"/><path d="M12 3v3"/><path d="M6.6 5A5 5 0 0 0 4 9.5c0 1.8.8 3.4 2 4.5v4a1 1 0 0 0 1 1h2v-3h2v3h2a1 1 0 0 0 1-1v-4a6 6 0 0 0 2-4.5A5 5 0 0 0 17.4 5"/><path d="M9 18h6"/></svg>' },
        { id: 'news',     label: 'News',     color: '#b0bec5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="18" y1="2" x2="18" y2="22"/><line x1="8" y1="10" x2="14" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg>' },
        { id: 'finance',  label: 'Finance',  color: '#a5d6a7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { id: 'clock',    label: 'Clock',    color: '#b0bec5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { id: 'chat',     label: 'Chat',     color: '#80cbc4', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
        { id: 'lock',     label: 'Private',  color: '#ef9a9a', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
        { id: 'calendar', label: 'Calendar', color: '#b0bec5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg>' },
        { id: 'folder',   label: 'Folder',   color: '#ffcc80', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' },
        { id: 'code',     label: 'Code',     color: '#80cbc4', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 8 4 12 9 16"/><polyline points="15 8 20 12 15 16"/></svg>' },

        { div: '✨ Special' },
        { id: 'nature',   label: 'Nature',   color: '#c5e1a5', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22V12"/><path d="M5 12c0-4 3-7 7-7s7 3 7 7c0 2.5-1.5 4.5-4 5.5"/><path d="M3 18c0-2.5 2-4 4.5-4C9 14 10 15.5 12 16"/></svg>' },
        { id: 'flower',   label: 'Flower',   color: '#f48fb1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zm0 14a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zm10-7a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM2 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3zm12.24-5.76a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm-8.48 0a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm0 8.48a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm8.48 0a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24z"/></svg>' },
        { id: 'fire',     label: 'Fire',     color: '#ff7043', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 0-4 4-4 9a4 4 0 0 0 8 0c0-2-1-4-1-4s-1 2-3 2c-1 0-2-1-2-2 0-2 2-5 2-5z"/><path d="M12 22c-3.31 0-6-2.69-6-6 0-2.5 1.5-4.5 1.5-4.5S9 13 12 13s4.5-1.5 4.5-1.5S18 13.5 18 16c0 3.31-2.69 6-6 6z"/></svg>' },
        { id: 'sun',      label: 'Sun',      color: '#ffd54f', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' },
        { id: 'award',    label: 'Award',    color: '#ffd54f', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>' },
        { id: 'bell',     label: 'Alert',    color: '#ffcc80', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
        { id: 'diamond',  label: 'VIP',      color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="2" y2="9"/><line x1="12" y1="3" x2="22" y2="9"/><line x1="12" y1="9" x2="12" y2="22"/></svg>' },
        { id: 'heart',    label: 'Heart',    color: '#f48fb1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/></svg>' },
        { id: 'rocket',   label: 'Rocket',   color: '#ce93d8', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 2 5 6 5 10 0 2-1 4-1 4l-4 3-4-3s-1-2-1-4c0-4 2-8 5-10z"/><circle cx="12" cy="9" r="1.6"/><path d="M8 15l-3 2 1-4M16 15l3 2-1-4"/></svg>' },
        { id: 'crown',    label: 'Crown',    color: '#ffd700', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 3 5-7 5 7 4-3-2 11H5z"/><line x1="5" y1="21" x2="19" y2="21"/></svg>' },
        { id: 'sparkle',  label: 'Sparkle',  color: '#fff176', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3l.6 1.7L21 5.3l-1.4.6L19 7.6l-.6-1.7-1.4-.6 1.4-.6z"/></svg>' },

        { div: '🐾 Animals & Nature' },
        { id: 'cat',  label: 'Cat',  color: '#ffab91', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l1-5 4 3h4l4-3 1 5"/><path d="M5 9a6 6 0 0 0 7 8 6 6 0 0 0 7-8c0 3-1.5 5-2.5 6-1 .8-2.7 1.3-4.5 1.3S8.5 15.8 7.5 15c-1-1-2.5-3-2.5-6z"/><circle cx="9.5" cy="11" r=".7" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11" r=".7" fill="currentColor" stroke="none"/></svg>' },
        { id: 'dog',  label: 'Dog',  color: '#d7ccc8', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7c-1.5 0-2.5 2-2 5"/><path d="M19 7c1.5 0 2.5 2 2 5"/><path d="M6 11c0-3 2.5-5 6-5s6 2 6 5c0 2-.5 3.5-1.5 4.5-.3 2-1.5 3.5-4.5 3.5s-4.2-1.5-4.5-3.5C6.5 14.5 6 13 6 11z"/><circle cx="9.5" cy="10.5" r=".8" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10.5" r=".8" fill="currentColor" stroke="none"/><ellipse cx="12" cy="13.5" rx="1.2" ry=".9" fill="currentColor" stroke="none"/></svg>' },
        { id: 'bird', label: 'Bird', color: '#90caf9', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6c-1.5.5-2.5 0-3-1-1.5 1-3 3-3 6 0 5-4 9-9 9-1.5 0-3-.5-4-1.5 2 0 3.5-1 4-2-1.5 0-2.5-1-3-2 1 0 2 0 2.5-.5C4.5 13 3 11.5 3 9c1 .5 2 .5 3 0-1-1-1.5-2.5-1-4 2 2 4 3 7 3 -.3-2 1-4 3-4.5 1.5-.5 3 0 4 1 1-.3 2-1 2.5-1.5-.2 1-.7 1.7-1.5 2z"/></svg>' },
        { id: 'fish', label: 'Fish', color: '#4dd0e1', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="12" rx="7" ry="4.5"/><path d="M17 9l4 3-4 3"/><circle cx="6.5" cy="11" r=".8" fill="currentColor" stroke="none"/><path d="M6 16.5c1 .8 2 1 3 .8"/></svg>' },
        { id: 'tree', label: 'Tree', color: '#81c784', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L7 9h3l-4 6h4l-3 5h10l-3-5h4l-4-6h3z"/><line x1="12" y1="22" x2="12" y2="20"/></svg>' },
        { id: 'rain', label: 'Rain', color: '#90a4ae', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16a5 5 0 0 1 1-9.9A6 6 0 0 1 19 9a4 4 0 0 1-1 8H7z"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/></svg>' }
    ];

    const RELEASE_ICON_FLAT = RELEASE_ICON_LIBRARY.filter(x => !x.div);
    const DEFAULT_RELEASE_ICON_KEY = 'none';

    function resolveReleaseIcon(iconKey) {
        return RELEASE_ICON_FLAT.find(ic => ic.id === iconKey)
            || RELEASE_ICON_FLAT.find(ic => ic.id === DEFAULT_RELEASE_ICON_KEY);
    }

    function showConfirmModal(title, body, danger, confirmLabel) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'gh-remark-confirm-overlay';

            const box = document.createElement('div');
            box.className = 'gh-remark-confirm-box';

            const titleEl = document.createElement('div');
            titleEl.className = 'gh-remark-confirm-title';
            titleEl.textContent = title;
            box.appendChild(titleEl);

            const bodyEl = document.createElement('div');
            bodyEl.className = 'gh-remark-confirm-body';
            bodyEl.textContent = body;
            box.appendChild(bodyEl);

            const actions = document.createElement('div');
            actions.className = 'gh-remark-confirm-actions';

            const settle = (result) => {
                overlay.remove();
                document.removeEventListener('keydown', onKeydown, true);
                resolve(result);
            };

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = t('modal.cancel');
            cancelBtn.addEventListener('click', () => settle(false));
            actions.appendChild(cancelBtn);

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = danger ? 'gh-remark-confirm-danger' : 'gh-remark-confirm-primary';
            confirmBtn.textContent = confirmLabel || (danger ? t('modal.reset') : t('modal.confirm'));
            confirmBtn.addEventListener('click', () => settle(true));
            actions.appendChild(confirmBtn);

            box.appendChild(actions);
            overlay.appendChild(box);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) settle(false);
            });

            const onKeydown = (e) => {
                if (e.key === 'Escape') { e.stopPropagation(); settle(false); }
            };
            document.addEventListener('keydown', onKeydown, true);

            document.body.appendChild(overlay);
            confirmBtn.focus();
        });
    }

    const REMARK_STORAGE_KEY = 'GRNT-cache';

    const DEFAULT_REMARK_TEXT_COLOR = '#e3b341';

    let _remarkCache = null;

    const RemarkStorage = {
        _ensureCache: () => {
            if (_remarkCache === null) {
                _remarkCache = GM_getValue(REMARK_STORAGE_KEY, []);
            }
        },
        save: () => GM_setValue(REMARK_STORAGE_KEY, _remarkCache),
        list: () => {
            RemarkStorage._ensureCache();
            return _remarkCache;
        },
        update: (username, remark, groupName, textColor) => {
            RemarkStorage._ensureCache();
            const idx = _remarkCache.findIndex(e => e.username === username);
            const now = Date.now() / 1000;
            if (idx > -1) {
                _remarkCache[idx].remark = remark;
                _remarkCache[idx].groupName = groupName;
                _remarkCache[idx].textColor = textColor;
                _remarkCache[idx].updatedAt = now;
            } else {
                _remarkCache.push({ username, remark, groupName, textColor, updatedAt: now });
            }
            RemarkStorage.save();
        },
        updateIcon: (username, iconKey) => {
            RemarkStorage._ensureCache();
            const idx = _remarkCache.findIndex(e => e.username === username);
            const now = Date.now() / 1000;
            if (idx > -1) {
                _remarkCache[idx].iconKey = iconKey;
                _remarkCache[idx].updatedAt = now;
            } else {
                _remarkCache.push({ username, remark: '', groupName: '', textColor: undefined, iconKey, updatedAt: now });
            }
            RemarkStorage.save();
        },
        getRawIcon: (username) => {
            RemarkStorage._ensureCache();
            const item = _remarkCache.find(e => e.username === username);
            return (item && item.iconKey) || DEFAULT_RELEASE_ICON_KEY;
        },
        updateRating: (username, rating) => {
            RemarkStorage._ensureCache();
            const idx = _remarkCache.findIndex(e => e.username === username);
            const now = Date.now() / 1000;
            if (idx > -1) {
                _remarkCache[idx].rating = rating;
                _remarkCache[idx].updatedAt = now;
            } else {
                _remarkCache.push({ username, remark: '', groupName: '', textColor: undefined, rating, updatedAt: now });
            }
            RemarkStorage.save();
        },
        get: (username) => {
            RemarkStorage._ensureCache();
            const item = _remarkCache.find(e => e.username === username);

            const gSettings = DisplaySettingsStorage.get();
            const lockActive = gSettings.iconLockEnabled;

            if (!item && !lockActive) return null;

            return {
                remark: item ? item.remark : '',
                groupName: item ? item.groupName : '',
                textColor: (item && item.textColor) || DEFAULT_REMARK_TEXT_COLOR,
                iconKey: lockActive
                    ? gSettings.iconLockKey
                    : ((item && item.iconKey) || DEFAULT_RELEASE_ICON_KEY),
                rating: (item && item.rating) || 0
            };
        },
        clearCategoryKey: (categoryKey) => {
            RemarkStorage._ensureCache();
            let changed = false;
            _remarkCache.forEach(entry => {
                if (entry.groupName === categoryKey) {
                    entry.groupName = '';
                    changed = true;
                }
            });
            if (changed) RemarkStorage.save();
        }
    };

    const BUILTIN_CATEGORIES = [
        { key: 'computer', label: 'Computer', color: '#e3b341' },
        { key: 'terminal', label: 'Terminal', color: '#7ee787' },
        { key: 'notes',    label: 'Notes',    color: '#79c0ff' },
        { key: 'js',       label: 'JS',       color: '#f0d264' },
        { key: 'css',      label: 'CSS',      color: '#c297ff' },
        { key: 'ai',       label: 'AI / ML',        color: '#ff9bce' },
        { key: 'web',      label: 'Web',            color: '#56d4dd' },
        { key: 'mobile',   label: 'Mobile',         color: '#ffa657' },
        { key: 'os',       label: 'OS / Systems',   color: '#a5a5a5' },
        { key: 'devops',   label: 'DevOps',         color: '#58a6ff' },
        { key: 'data',     label: 'Data',           color: '#d2a8ff' },
        { key: 'security', label: 'Security',       color: '#f85149' },
        { key: 'game',     label: 'Game Dev',       color: '#3fb950' },
        { key: 'cli',      label: 'CLI / Tool',     color: '#ffd33d' },
        { key: 'library',  label: 'Library',        color: '#79b8ff' },
        { key: 'docs',     label: 'Docs / Learning', color: '#e6a4ff' },
        { key: 'hardware', label: 'Hardware / IoT', color: '#ff7b72' },
        { key: 'misc',     label: 'Misc',           color: '#8b949e' }
    ];
    const DEFAULT_GROUP_ID = '__default__';

    const CATEGORY_GROUP_STORAGE_KEY = 'GRNT-categoryGroups';
    let _categoryGroupCache = null;

    const GroupStorage = {
        _ensureCache: () => {
            if (_categoryGroupCache === null) {
                const stored = GM_getValue(CATEGORY_GROUP_STORAGE_KEY, null);
                _categoryGroupCache = stored !== null
                    ? stored
                    : [{ id: DEFAULT_GROUP_ID, label: 'Default', order: 0 }];
                if (stored === null) GM_setValue(CATEGORY_GROUP_STORAGE_KEY, _categoryGroupCache);
            }
        },
        list: () => {
            GroupStorage._ensureCache();
            return _categoryGroupCache;
        },
        add: (label) => {
            GroupStorage._ensureCache();
            const entry = {
                id: 'group_' + crypto.randomUUID(),
                label,
                order: _categoryGroupCache.length
            };
            _categoryGroupCache.push(entry);
            GM_setValue(CATEGORY_GROUP_STORAGE_KEY, _categoryGroupCache);
            return entry;
        },
        remove: (groupId) => {
            if (groupId === DEFAULT_GROUP_ID) return;
            GroupStorage._ensureCache();
            _categoryGroupCache = _categoryGroupCache.filter(g => g.id !== groupId);
            GM_setValue(CATEGORY_GROUP_STORAGE_KEY, _categoryGroupCache);
            CustomCategoryStorage._removeByGroup(groupId);
        }
    };

    const CUSTOM_CATEGORY_STORAGE_KEY = 'GRNT-customCategories-v2';
    let _customCategoryCache = null;

    const CustomCategoryStorage = {
        _ensureCache: () => {
            if (_customCategoryCache === null) {
                _customCategoryCache = GM_getValue(CUSTOM_CATEGORY_STORAGE_KEY, []);
            }
        },
        list: () => {
            CustomCategoryStorage._ensureCache();
            return _customCategoryCache;
        },
        add: (label, color, groupId) => {
            CustomCategoryStorage._ensureCache();
            const entry = {
                key: 'custom_' + crypto.randomUUID(),
                label, color, groupId,
                order: _customCategoryCache.filter(c => c.groupId === groupId).length
            };
            _customCategoryCache.push(entry);
            GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
            return entry;
        },
        update: (key, label, color) => {
            CustomCategoryStorage._ensureCache();
            const entry = _customCategoryCache.find(c => c.key === key);
            if (!entry) return false;
            entry.label = label;
            entry.color = color;
            GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
            return true;
        },
        remove: (key) => {
            CustomCategoryStorage._ensureCache();
            _customCategoryCache = _customCategoryCache.filter(c => c.key !== key);
            GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
            RemarkStorage.clearCategoryKey(key);
        },
        _removeByGroup: (groupId) => {
            CustomCategoryStorage._ensureCache();
            const removedKeys = _customCategoryCache
                .filter(c => c.groupId === groupId)
                .map(c => c.key);
            _customCategoryCache = _customCategoryCache.filter(c => c.groupId !== groupId);
            GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
            removedKeys.forEach(key => RemarkStorage.clearCategoryKey(key));
        }
    };

    const PANEL_SCALE_STORAGE_KEY = 'GRNT-panelScale';

    const PANEL_SCALE_LEVELS = { small: 1, medium: 1.25, large: 1.5 };
    const PANEL_SCALE_ORDER = ['small', 'medium', 'large'];
    const DEFAULT_PANEL_SCALE = 'small';

    function getPanelScaleLevel() {
        return GM_getValue(PANEL_SCALE_STORAGE_KEY, DEFAULT_PANEL_SCALE);
    }

    function setPanelScaleLevel(level) {
        GM_setValue(PANEL_SCALE_STORAGE_KEY, level);
        document.documentElement.style.setProperty(
            '--gh-remark-panel-scale', PANEL_SCALE_LEVELS[level] || 1
        );
    }

    const DISPLAY_SETTINGS_STORAGE_KEY = 'GRNT-displaySettings';
    const DISPLAY_SETTINGS_DEFAULTS = {
        fontSize: 12,
        pillGlow: 4,
        pillRadius: 10,
        pillGap: 4,
        pillScale: 100,
        iconGlowEnabled: true,
        iconGlow: 4,
        editIconAlwaysVisible: true,
        enableStarredPage: true,
        enableRepositoriesPage: true,
        enableOrgReposPage: false,
        remarkBeforeVisibilityLabel: false,
        iconLockEnabled: false,
        iconLockKey: DEFAULT_RELEASE_ICON_KEY,
        ratingStarsEnabled: false
    };
    let _displaySettingsCache = null;

    const LAST_EXPORT_STORAGE_KEY = 'GRNT-lastExportAt';

    const USER_DISPLAY_NAME_STORAGE_KEY = 'GRNT-userDisplayNames';
    const UserDisplayNameStorage = {
        get: (username) => GM_getValue(USER_DISPLAY_NAME_STORAGE_KEY, {})[username] || '',
        set: (username, name) => {
            const all = GM_getValue(USER_DISPLAY_NAME_STORAGE_KEY, {});
            const trimmed = name.trim();
            if (trimmed) {
                all[username] = trimmed;
            } else {
                delete all[username];
            }
            GM_setValue(USER_DISPLAY_NAME_STORAGE_KEY, all);
        }
    };

    const DisplaySettingsStorage = {
        _ensureCache: () => {
            if (_displaySettingsCache === null) {
                _displaySettingsCache = Object.assign(
                    {}, DISPLAY_SETTINGS_DEFAULTS,
                    GM_getValue(DISPLAY_SETTINGS_STORAGE_KEY, {})
                );
            }
        },
        get: () => {
            DisplaySettingsStorage._ensureCache();
            return _displaySettingsCache;
        },
        update: (patch) => {
            DisplaySettingsStorage._ensureCache();
            Object.assign(_displaySettingsCache, patch);
            GM_setValue(DISPLAY_SETTINGS_STORAGE_KEY, _displaySettingsCache);
        }
    };

    function applyDisplaySettings() {
        const s = DisplaySettingsStorage.get();
        document.documentElement.style.setProperty('--gh-remark-text-size', s.fontSize + 'px');
        document.documentElement.style.setProperty('--gh-remark-pill-glow', s.pillGlow + 'px');
        document.documentElement.style.setProperty('--gh-remark-pill-radius', s.pillRadius + 'px');
        document.documentElement.style.setProperty('--gh-remark-pill-gap', s.pillGap + 'px');
        document.documentElement.style.setProperty('--gh-remark-pill-scale', s.pillScale / 100);
        document.documentElement.style.setProperty(
            '--gh-remark-icon-glow', (s.iconGlowEnabled ? s.iconGlow : 0) + 'px'
        );
        document.documentElement.classList.toggle('gh-remark-edit-hover-only', !s.editIconAlwaysVisible);
    }

    function showReloadHint() {
        const existing = document.querySelector('.gh-remark-reload-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'gh-remark-reload-toast';

        const text = document.createElement('span');
        text.textContent = t('saved.reloadHint');
        toast.appendChild(text);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gh-remark-reload-toast-btn';
        btn.textContent = t('saved.reload');
        btn.addEventListener('click', () => location.reload());
        toast.appendChild(btn);

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('gh-remark-reload-toast--fade'), 4000);
        setTimeout(() => toast.remove(), 4300);
    }

    const EXPORT_FORMAT_VERSION = 1;

    function exportAllSettings() {
        const payload = {
            formatVersion: EXPORT_FORMAT_VERSION,
            scriptVersion: (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) || 'unknown',
            exportedAt: Date.now(),
            remarks: RemarkStorage.list(),
            customCategories: CustomCategoryStorage.list(),
            categoryGroups: GroupStorage.list(),
            displaySettings: DisplaySettingsStorage.get(),
            panelScale: getPanelScaleLevel()
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date(payload.exportedAt);
        const pad = (n) => String(n).padStart(2, '0');
        const stamp = `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}`;
        a.href = url;
        a.download = `github-repo-notes-and-tags-backup_${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        GM_setValue(LAST_EXPORT_STORAGE_KEY, payload.exportedAt);
        return payload.exportedAt;
    }

    function parseImportFile(text) {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { ok: false, error: t('backup.notValidJson') };
        }
        if (!data || typeof data !== 'object') {
            return { ok: false, error: t('backup.notValidBackup') };
        }
        if (!Array.isArray(data.remarks) || !Array.isArray(data.customCategories) ||
            !data.displaySettings || typeof data.displaySettings !== 'object') {
            return { ok: false, error: t('backup.missingData') };
        }
        if (!Array.isArray(data.categoryGroups)) {
            data.categoryGroups = [{ id: DEFAULT_GROUP_ID, label: 'Default', order: 0 }];
        }
        if (!PANEL_SCALE_LEVELS.hasOwnProperty(data.panelScale)) {
            data.panelScale = DEFAULT_PANEL_SCALE;
        }
        return { ok: true, data };
    }

    function importAllSettings(data) {
        _remarkCache = data.remarks;
        RemarkStorage.save();
        _customCategoryCache = data.customCategories;
        GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
        _categoryGroupCache = data.categoryGroups;
        GM_setValue(CATEGORY_GROUP_STORAGE_KEY, _categoryGroupCache);
        DisplaySettingsStorage.update(data.displaySettings);
        setPanelScaleLevel(data.panelScale);
    }

    function computeRemarkStats() {
        const entries = RemarkStorage.list();
        const byCategory = {};
        entries.forEach(e => {
            const key = e.groupName || '';
            byCategory[key] = (byCategory[key] || 0) + 1;
        });
        return { total: entries.length, byCategory };
    }

    function resetAllToDefaults() {
        _remarkCache = [];
        RemarkStorage.save();
        _customCategoryCache = [];
        GM_setValue(CUSTOM_CATEGORY_STORAGE_KEY, _customCategoryCache);
        _categoryGroupCache = [{ id: DEFAULT_GROUP_ID, label: 'Default', order: 0 }];
        GM_setValue(CATEGORY_GROUP_STORAGE_KEY, _categoryGroupCache);
        _displaySettingsCache = Object.assign({}, DISPLAY_SETTINGS_DEFAULTS);
        GM_setValue(DISPLAY_SETTINGS_STORAGE_KEY, _displaySettingsCache);
    }

    function exportLanguageTemplate() {
        const payload = {
            _note: [
                '=== AI TRANSLATION INSTRUCTIONS ===',
                'TASK: Translate ONLY the string VALUES under "strings". Do NOT rename, remove, or reorder any KEY.',
                'Every key present in the input "strings" object MUST also be present in your output, with no omissions.',
                'Keep ALL {placeholder} tokens UNCHANGED, exactly as spelled (e.g. {n}, {s}, {label}, {date}, {name}, {error}, {those}, {one}, {y}).',
                'Keep ALL emoji characters UNCHANGED.',
                'Set "langName" to this language\'s own native name (e.g. "Deutsch", "Tiếng Việt", "العربية") — this is what users will see in the language picker.',
                'Set "langCode" to a short BCP-47-style code for this language (e.g. "de", "vi", "ar") if not already filled in.',
                'Leave "_note" and "formatVersion" exactly as they are — do not translate or remove them.',
                'Output the complete JSON only, in a single code block.',
            ],
            formatVersion: 1,
            langCode: '',
            langName: '',
            strings: Object.assign({}, I18N_STRINGS.en),
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'github-repo-notes-and-tags-language-template.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function parseLanguageImportFile(text) {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { ok: false, error: t('language.notValidJson') };
        }
        if (!data || typeof data !== 'object' || !data.strings || typeof data.strings !== 'object') {
            return { ok: false, error: t('language.notValidFile') };
        }
        const code = (typeof data.langCode === 'string' && data.langCode.trim()) || null;
        const name = (typeof data.langName === 'string' && data.langName.trim()) || null;
        if (!code || !name) {
            return { ok: false, error: t('language.missingNameOrCode') };
        }
        if (BUILTIN_LANGUAGES[code]) {
            return { ok: false, error: t('language.importError', { error: code }) };
        }
        return { ok: true, code, name, strings: data.strings };
    }

    function getAllCategories() {
        return BUILTIN_CATEGORIES.concat(CustomCategoryStorage.list());
    }

    function findCategory(key) {
        return getAllCategories().find(c => c.key === key) || null;
    }

    function getCategoriesGroupedByTab() {
        const groups = GroupStorage.list().slice().sort((a, b) => a.order - b.order);
        const customCats = CustomCategoryStorage.list();
        return groups.map(group => ({
            group,
            categories: group.id === DEFAULT_GROUP_ID
                ? BUILTIN_CATEGORIES.concat(customCats.filter(c => c.groupId === DEFAULT_GROUP_ID))
                : customCats.filter(c => c.groupId === group.id)
        }));
    }

    function buildCategoryPill(categoryKey) {
        const cat = findCategory(categoryKey);
        if (!cat) return null;
        const label = cat.label;
        const color = cat.color;

        const pill = document.createElement('span');
        pill.className = 'gh-remark-cat-pill';
        pill.style.setProperty('--cat-color', color);

        const dot = document.createElement('span');
        dot.className = 'gh-remark-cat-pill-dot';
        pill.appendChild(dot);

        const text = document.createElement('span');
        text.className = 'gh-remark-cat-pill-label';
        text.textContent = label;
        text.title = label;
        pill.appendChild(text);

        return pill;
    }

    function buildCategorySelect(selectedKey, onPick) {
        const root = document.createElement('span');
        root.className = 'gh-remark-cat-select';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gh-remark-cat-select-btn';

        const btnDot = document.createElement('span');
        btnDot.className = 'gh-remark-cat-option-dot';
        const btnLabel = document.createElement('span');
        btnLabel.className = 'gh-remark-cat-select-label';

        const refreshButtonFace = (key) => {
            const cat = findCategory(key);
            if (cat) {
                btnDot.style.background = cat.color;
                btnDot.style.display = '';
                btnLabel.textContent = cat.label;
                btnLabel.title = cat.label;
            } else {
                btnDot.style.display = 'none';
                btnLabel.textContent = t('category.none');
                btnLabel.title = '';
            }
        };
        refreshButtonFace(selectedKey);

        btn.appendChild(btnDot);
        btn.appendChild(btnLabel);

        const list = document.createElement('span');
        list.className = 'gh-remark-cat-select-list';

        const isOrgReposPage = () => {
            const rule = PAGE_CONTAINER_RULES.find(r => r.kind === 'org-repos');
            return !!(rule && rule.match());
        };

        const close = () => {
            root.classList.remove('open', 'align-right');
            document.removeEventListener('click', onDocClick, true);
            document.removeEventListener('scroll', onScrollClose, true);
            list.style.position = '';
            list.style.top = '';
            list.style.left = '';
            list.style.right = '';
        };
        const onDocClick = (e) => {
            if (!root.contains(e.target)) close();
        };
        const onScrollClose = (e) => {
            if (root.contains(e.target)) return;
            close();
        };

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !root.classList.contains('open');
            root.classList.toggle('open', willOpen);
            if (willOpen) {
                const r = btn.getBoundingClientRect();
                const panelWidth = list.getBoundingClientRect().width || 420;
                const overflowsRight = r.left + panelWidth > window.innerWidth;
                const fitsRight = r.right - panelWidth >= 0;
                const alignRight = overflowsRight && fitsRight;
                root.classList.toggle('align-right', alignRight);
                if (isOrgReposPage()) {
                    list.style.position = 'fixed';
                    list.style.top = `${r.bottom + 4}px`;
                    list.style.right = 'auto';
                    list.style.left = alignRight
                        ? `${r.right - panelWidth}px`
                        : `${r.left}px`;
                }
                setTimeout(() => {
                    document.addEventListener('click', onDocClick, true);
                    document.addEventListener('scroll', onScrollClose, true);
                }, 0);
            } else {
                close();
            }
        };

        let currentSelectedKey = selectedKey;

        const handleDataChange = (deletedKey) => {
            if (deletedKey && deletedKey === currentSelectedKey) {
                currentSelectedKey = '';
                refreshButtonFace('');
                onPick('');
            }
            renderTabs();
            renderBody();
        };

        const addOption = (grid, cat, extraClass) => {
            const opt = document.createElement('span');
            opt.className = extraClass ? 'gh-remark-cat-option ' + extraClass : 'gh-remark-cat-option';
            if (cat.color) {
                const dot = document.createElement('span');
                dot.className = 'gh-remark-cat-option-dot';
                dot.style.background = cat.color;
                opt.appendChild(dot);
            }
            const text = document.createElement('span');
            text.className = 'gh-remark-cat-option-label';
            text.textContent = cat.label;
            text.title = cat.label;
            opt.appendChild(text);
            opt.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                refreshButtonFace(cat.key);
                close();
                onPick(cat.key);
            };
            if (cat.groupId) {
                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'gh-remark-cat-option-edit';
                editBtn.title = t('category.edit');
                editBtn.textContent = '✏️';
                editBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editingCategory = cat;
                    mode = 'edit-category';
                    renderBody();
                };
                opt.appendChild(editBtn);

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'gh-remark-cat-option-del';
                delBtn.title = t('category.delete');
                delBtn.textContent = '✕';
                delBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    CustomCategoryStorage.remove(cat.key);
                    handleDataChange(cat.key);
                };
                opt.appendChild(delBtn);
            }
            grid.appendChild(opt);
        };

        const tabBar = document.createElement('span');
        tabBar.className = 'gh-remark-cat-tab-bar';

        const grid = document.createElement('span');
        grid.className = 'gh-remark-cat-select-grid';

        let activeGroupId = null;
        let mode = 'browse';
        let editingCategory = null;

        const renderBody = () => {
            grid.innerHTML = '';
            if (mode === 'add-category') {
                grid.appendChild(buildAddCategoryForm());
                return;
            }
            if (mode === 'edit-category') {
                grid.appendChild(buildEditCategoryForm(editingCategory));
                return;
            }
            const noneOpt = { key: '', label: 'None', color: null, groupId: null };
            addOption(grid, noneOpt, 'gh-remark-cat-option-none-tile');
            const groupData = getCategoriesGroupedByTab().find(g => g.group.id === activeGroupId);
            if (groupData) {
                groupData.categories.forEach(cat => addOption(grid, cat));
            }
            const addTile = document.createElement('button');
            addTile.type = 'button';
            addTile.className = 'gh-remark-cat-add-tile';
            addTile.title = t('category.add');
            addTile.textContent = '➕';
            addTile.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                mode = 'add-category';
                renderBody();
            };
            grid.appendChild(addTile);
        };

        const buildAddCategoryForm = () => {
            const result = document.createDocumentFragment();

            const title = document.createElement('span');
            title.className = 'gh-remark-cat-inline-form-title';
            title.textContent = t('category.new');
            result.appendChild(title);

            const formWrap = document.createElement('span');
            formWrap.className = 'gh-remark-cat-inline-form';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = t('category.namePlaceholder');

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = '#e3b341';
            colorInput.title = t('category.color');

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.textContent = '+';
            confirmBtn.title = t('category.add');

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = '✕';
            cancelBtn.title = t('modal.cancel');
            cancelBtn.className = 'gh-remark-cat-inline-form-cancel';

            const submit = () => {
                const label = nameInput.value.trim();
                if (!label) { nameInput.focus(); return; }
                CustomCategoryStorage.add(label, colorInput.value, activeGroupId);
                mode = 'browse';
                handleDataChange();
            };
            confirmBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                submit();
            };
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                mode = 'browse';
                renderBody();
            };
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); mode = 'browse'; renderBody(); }
            });
            formWrap.addEventListener('click', (e) => e.stopPropagation());

            formWrap.appendChild(nameInput);
            formWrap.appendChild(colorInput);
            formWrap.appendChild(confirmBtn);
            formWrap.appendChild(cancelBtn);
            result.appendChild(formWrap);
            setTimeout(() => nameInput.focus(), 0);
            return result;
        };

        const buildEditCategoryForm = (category) => {
            const result = document.createDocumentFragment();

            const title = document.createElement('span');
            title.className = 'gh-remark-cat-inline-form-title';
            title.textContent = t('category.edit');
            result.appendChild(title);

            const formWrap = document.createElement('span');
            formWrap.className = 'gh-remark-cat-inline-form';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = category.label;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = category.color;
            colorInput.title = t('category.color');

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.textContent = '✓';
            confirmBtn.title = t('category.saveChanges');

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = '✕';
            cancelBtn.title = t('modal.cancel');
            cancelBtn.className = 'gh-remark-cat-inline-form-cancel';

            const submit = () => {
                const label = nameInput.value.trim();
                if (!label) { nameInput.focus(); return; }
                CustomCategoryStorage.update(category.key, label, colorInput.value);
                if (currentSelectedKey === category.key) refreshButtonFace(category.key);
                mode = 'browse';
                handleDataChange();
            };
            confirmBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                submit();
            };
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                mode = 'browse';
                renderBody();
            };
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); mode = 'browse'; renderBody(); }
            });
            formWrap.addEventListener('click', (e) => e.stopPropagation());

            formWrap.appendChild(nameInput);
            formWrap.appendChild(colorInput);
            formWrap.appendChild(confirmBtn);
            formWrap.appendChild(cancelBtn);
            result.appendChild(formWrap);
            setTimeout(() => { nameInput.focus(); nameInput.select(); }, 0);
            return result;
        };

        const buildAddGroupForm = () => {
            const formWrap = document.createElement('span');
            formWrap.className = 'gh-remark-cat-inline-form';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = t('group.namePlaceholder');

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.textContent = '+';
            confirmBtn.title = t('group.add');

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = '✕';
            cancelBtn.title = t('modal.cancel');
            cancelBtn.className = 'gh-remark-cat-inline-form-cancel';

            const submit = () => {
                const label = nameInput.value.trim();
                if (!label) { nameInput.focus(); return; }
                const newGroup = GroupStorage.add(label);
                activeGroupId = newGroup.id;
                mode = 'browse';
                handleDataChange();
            };
            confirmBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                submit();
            };
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                mode = 'browse';
                renderTabs();
            };
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); mode = 'browse'; renderTabs(); }
            });
            formWrap.addEventListener('click', (e) => e.stopPropagation());

            formWrap.appendChild(nameInput);
            formWrap.appendChild(confirmBtn);
            formWrap.appendChild(cancelBtn);
            setTimeout(() => nameInput.focus(), 0);
            return formWrap;
        };

        const renderTabs = () => {
            tabBar.innerHTML = '';
            if (mode === 'add-group') {
                tabBar.appendChild(buildAddGroupForm());
                return;
            }
            const groupedTabs = getCategoriesGroupedByTab();
            if (!groupedTabs.some(g => g.group.id === activeGroupId)) {
                activeGroupId = groupedTabs[0].group.id;
            }
            groupedTabs.forEach(({ group }) => {
                const tabBtn = document.createElement('button');
                tabBtn.type = 'button';
                tabBtn.className = 'gh-remark-cat-tab-btn';
                tabBtn.classList.toggle('gh-remark-cat-tab-btn--active', group.id === activeGroupId);
                tabBtn.textContent = group.label;
                tabBtn.title = group.label;
                tabBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    activeGroupId = group.id;
                    renderTabs();
                    renderBody();
                };
                if (group.id !== DEFAULT_GROUP_ID) {
                    const delBtn = document.createElement('button');
                    delBtn.type = 'button';
                    delBtn.className = 'gh-remark-cat-tab-del';
                    delBtn.title = t('group.deleteTip');
                    delBtn.textContent = '✕';
                    delBtn.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!e.shiftKey) {
                            const catCount = CustomCategoryStorage.list()
                                .filter(c => c.groupId === group.id).length;
                            const proceed = await showConfirmModal(
                                t('group.deleteConfirmTitle', { label: group.label }),
                                catCount > 0
                                    ? t('group.deleteConfirmBodyWithCats', {
                                        n: catCount,
                                        y: catCount === 1 ? 'y' : 'ies',
                                        those: catCount === 1 ? 'that category' : 'all of them',
                                        one: catCount === 1 ? 'it' : 'one of them',
                                    })
                                    : t('group.deleteConfirmBodyEmpty'),
                                true,
                                t('modal.delete')
                            );
                            if (!proceed) return;
                        }
                        const selectedCat = currentSelectedKey ? findCategory(currentSelectedKey) : null;
                        const orphaned = selectedCat && selectedCat.groupId === group.id;
                        GroupStorage.remove(group.id);
                        handleDataChange(orphaned ? currentSelectedKey : null);
                    };
                    tabBtn.appendChild(delBtn);
                }
                tabBar.appendChild(tabBtn);
            });
            const addGroupTabBtn = document.createElement('button');
            addGroupTabBtn.type = 'button';
            addGroupTabBtn.className = 'gh-remark-cat-tab-btn gh-remark-cat-tab-btn--add';
            addGroupTabBtn.textContent = '+';
            addGroupTabBtn.title = t('group.new');
            addGroupTabBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                mode = 'add-group';
                renderTabs();
            };
            tabBar.appendChild(addGroupTabBtn);
        };

        renderTabs();
        renderBody();

        const introHint = document.createElement('span');
        introHint.className = 'gh-remark-cat-select-hint';

        const hintText = document.createElement('span');
        hintText.className = 'gh-remark-cat-select-hint-text';
        hintText.textContent = t('category.pickOrManage');

        const shiftTip = document.createElement('span');
        shiftTip.className = 'gh-remark-cat-select-hint-tip';
        shiftTip.textContent = t('category.shiftDeleteTip');
        hintText.appendChild(shiftTip);
        introHint.appendChild(hintText);

        const scaleBtn = document.createElement('button');
        scaleBtn.type = 'button';
        scaleBtn.className = 'gh-remark-panel-scale-btn';
        scaleBtn.innerHTML =
            '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/>' +
            '<line x1="10" y1="7" x2="10" y2="13"/><line x1="7" y1="10" x2="13" y2="10"/>' +
            '<line x1="14.5" y1="14.5" x2="20" y2="20"/></svg>' +
            '<span class="gh-remark-panel-scale-btn-label"></span>';
        const scaleLabelEl = scaleBtn.querySelector('.gh-remark-panel-scale-btn-label');

        const refreshScaleBtnFace = () => {
            const level = getPanelScaleLevel();
            scaleLabelEl.textContent = level.charAt(0).toUpperCase();
            scaleBtn.title =
                `Panel size: ${level.charAt(0).toUpperCase() + level.slice(1)} (click to cycle)`;
        };
        refreshScaleBtnFace();

        scaleBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentIndex = PANEL_SCALE_ORDER.indexOf(getPanelScaleLevel());
            const nextLevel = PANEL_SCALE_ORDER[(currentIndex + 1) % PANEL_SCALE_ORDER.length];
            setPanelScaleLevel(nextLevel);
            refreshScaleBtnFace();
        };
        introHint.appendChild(scaleBtn);

        list.appendChild(introHint);
        list.appendChild(tabBar);
        list.appendChild(grid);

        root.appendChild(btn);
        root.appendChild(list);
        return root;
    }

    function openCategoryPanel(anchorWrapper, gearBtn, onChange, username, releaseIconEl) {
        const existing = document.querySelector('.gh-remark-cat-panel');
        if (existing) {
            if (existing._ghRemarkCleanup) existing._ghRemarkCleanup();
            existing.remove();
        }
        const existingSidePanel = document.querySelector('.gh-remark-icon-side-panel');
        if (existingSidePanel) existingSidePanel.remove();

        const panel = document.createElement('div');
        panel.className = 'gh-remark-cat-panel';

        const tabBar = document.createElement('div');
        tabBar.className = 'gh-remark-tab-bar';

        const tab1Btn = document.createElement('button');
        tab1Btn.type = 'button';
        tab1Btn.className = 'gh-remark-tab-btn';
        tab1Btn.textContent = t('panel.tab.standard');

        const tab2Btn = document.createElement('button');
        tab2Btn.type = 'button';
        tab2Btn.className = 'gh-remark-tab-btn';
        tab2Btn.textContent = t('panel.tab.other');

        tabBar.appendChild(tab1Btn);
        tabBar.appendChild(tab2Btn);
        panel.appendChild(tabBar);

        const tab1Content = document.createElement('div');
        tab1Content.className = 'gh-remark-tab-content';
        const tab2Content = document.createElement('div');
        tab2Content.className = 'gh-remark-tab-content';
        tab2Content.style.display = 'none';
        panel.appendChild(tab1Content);
        panel.appendChild(tab2Content);

        function switchTab(n) {
            const toTab2 = n === 2;
            tab1Content.style.display = toTab2 ? 'none' : '';
            tab2Content.style.display = toTab2 ? '' : 'none';
            tab1Btn.classList.toggle('gh-remark-tab-btn--active', !toTab2);
            tab2Btn.classList.toggle('gh-remark-tab-btn--active', toTab2);
        }

        tab1Btn.addEventListener('click', () => switchTab(1));
        tab2Btn.addEventListener('click', () => switchTab(2));

        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); closePanel(); }
        });

        const displayTitle = document.createElement('div');
        displayTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        displayTitle.textContent = t('panel.displaySettings');
        tab1Content.appendChild(displayTitle);

        const settings = DisplaySettingsStorage.get();

        const buildResetBtn = (settingsKey, slider, valueText, unit) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gh-remark-reset-btn';
            btn.title = t('panel.resetToDefault');
            btn.innerHTML = RESET_ICON_SVG;
            btn.addEventListener('click', () => {
                const def = DISPLAY_SETTINGS_DEFAULTS[settingsKey];
                slider.value = String(def);
                valueText.textContent = def + unit;
                DisplaySettingsStorage.update({ [settingsKey]: def });
                applyDisplaySettings();
            });
            return btn;
        };

        const sizeRow = document.createElement('div');
        sizeRow.className = 'gh-remark-cat-panel-row';
        const sizeLabel = document.createElement('span');
        sizeLabel.className = 'gh-remark-cat-panel-row-label';
        sizeLabel.textContent = t('panel.noteSize');
        const sizeValue = document.createElement('span');
        sizeValue.textContent = settings.fontSize + 'px';
        sizeValue.style.opacity = '0.7';
        sizeValue.style.marginRight = '4px';
        const sizeSlider = document.createElement('input');
        sizeSlider.type = 'range';
        sizeSlider.className = 'gh-remark-cat-panel-slider';
        sizeSlider.min = '8';
        sizeSlider.max = '32';
        sizeSlider.step = '1';
        sizeSlider.value = settings.fontSize;
        sizeSlider.style.width = '80px';
        sizeSlider.addEventListener('input', () => {
            const px = Number(sizeSlider.value);
            sizeValue.textContent = px + 'px';
            DisplaySettingsStorage.update({ fontSize: px });
            applyDisplaySettings();
        });
        sizeRow.appendChild(sizeLabel);
        sizeRow.appendChild(sizeValue);
        sizeRow.appendChild(sizeSlider);
        sizeRow.appendChild(buildResetBtn('fontSize', sizeSlider, sizeValue, 'px'));
        tab1Content.appendChild(sizeRow);

        const buildCheckboxRow = (labelText, settingsKey, onToggle, needsReload) => {
            const row = document.createElement('div');
            row.className = 'gh-remark-cat-panel-row';
            const label = document.createElement('span');
            label.className = 'gh-remark-cat-panel-row-label';
            label.textContent = labelText;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !!settings[settingsKey];
            checkbox.className = 'gh-remark-cat-panel-checkbox';
            checkbox.addEventListener('change', () => {
                DisplaySettingsStorage.update({ [settingsKey]: checkbox.checked });
                applyDisplaySettings();
                if (onToggle) onToggle(checkbox.checked);
                if (needsReload) showReloadHint();
            });
            row.appendChild(label);
            row.appendChild(checkbox);
            tab1Content.appendChild(row);
            return checkbox;
        };

        buildCheckboxRow(t('panel.editIconAlwaysVisible'), 'editIconAlwaysVisible');

        buildCheckboxRow(t('panel.remarkBeforeVisibility'), 'remarkBeforeVisibilityLabel', null, true);
        const remarkOrderHint = document.createElement('div');
        remarkOrderHint.className = 'gh-remark-cat-panel-empty';
        remarkOrderHint.style.fontSize = '11px';
        remarkOrderHint.textContent = t('panel.reloadAfterChange');
        tab1Content.appendChild(remarkOrderHint);

        buildCheckboxRow(t('panel.enableRatingStars'), 'ratingStarsEnabled', null, true);
        const ratingHint = document.createElement('div');
        ratingHint.className = 'gh-remark-cat-panel-empty';
        ratingHint.style.fontSize = '11px';
        ratingHint.textContent = t('panel.reloadAfterChange');
        tab1Content.appendChild(ratingHint);

        const pageSupportTitle = document.createElement('div');
        pageSupportTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        pageSupportTitle.textContent = t('panel.pageSupport');
        tab1Content.appendChild(pageSupportTitle);

        buildCheckboxRow(t('panel.pageStarred'), 'enableStarredPage', null, true);
        buildCheckboxRow(t('panel.pageRepositories'), 'enableRepositoriesPage', null, true);
        buildCheckboxRow(t('panel.pageOrgRepos'), 'enableOrgReposPage', null, true);

        const pageSupportHint = document.createElement('div');
        pageSupportHint.className = 'gh-remark-cat-panel-empty';
        pageSupportHint.style.fontSize = '11px';
        pageSupportHint.textContent = t('panel.reloadAfterChanges');
        tab1Content.appendChild(pageSupportHint);

        const pillTitle = document.createElement('div');
        pillTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        pillTitle.textContent = t('panel.pillStyle');
        tab1Content.appendChild(pillTitle);

        const buildSliderRow = (labelText, settingsKey, min, max, unit) => {
            const row = document.createElement('div');
            row.className = 'gh-remark-cat-panel-row';
            const label = document.createElement('span');
            label.className = 'gh-remark-cat-panel-row-label';
            label.textContent = labelText;
            const valueText = document.createElement('span');
            valueText.textContent = settings[settingsKey] + unit;
            valueText.style.opacity = '0.7';
            valueText.style.marginRight = '4px';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'gh-remark-cat-panel-slider';
            slider.min = String(min);
            slider.max = String(max);
            slider.step = '1';
            slider.value = String(settings[settingsKey]);
            slider.style.width = '80px';
            slider.addEventListener('input', () => {
                const val = Number(slider.value);
                valueText.textContent = val + unit;
                DisplaySettingsStorage.update({ [settingsKey]: val });
                applyDisplaySettings();
            });
            row.appendChild(label);
            row.appendChild(valueText);
            row.appendChild(slider);
            row.appendChild(buildResetBtn(settingsKey, slider, valueText, unit));
            tab1Content.appendChild(row);
            return slider;
        };

        buildSliderRow(t('panel.pillGlow'), 'pillGlow', 0, 24, 'px');
        buildSliderRow(t('panel.pillCorners'), 'pillRadius', 0, 24, 'px');
        buildSliderRow(t('panel.pillSpacing'), 'pillGap', 0, 32, 'px');
        buildSliderRow(t('panel.pillSize'), 'pillScale', 50, 250, '%');

        const iconGlowSlider = buildSliderRow(t('panel.releaseIconGlow'), 'iconGlow', 0, 20, 'px');
        const setIconGlowSliderEnabled = (enabled) => {
            iconGlowSlider.disabled = !enabled;
            iconGlowSlider.style.opacity = enabled ? '1' : '0.4';
        };
        setIconGlowSliderEnabled(settings.iconGlowEnabled);
        buildCheckboxRow(t('panel.enableReleaseIconGlow'), 'iconGlowEnabled', setIconGlowSliderEnabled);

        if (username) {
            const sidePanelHint = document.createElement('div');
            sidePanelHint.className = 'gh-remark-cat-panel-empty';
            sidePanelHint.textContent = t('panel.releaseIconPickerHint');
            tab1Content.appendChild(sidePanelHint);
        }

        let sidePanel = null;
        if (username) {
            sidePanel = document.createElement('div');
            sidePanel.className = 'gh-remark-icon-side-panel';

            const flashIconPress = (btn) => {
                btn.classList.remove('gh-remark-press-pulse');
                void btn.offsetWidth;
                btn.classList.add('gh-remark-press-pulse');
                setTimeout(() => btn.classList.remove('gh-remark-press-pulse'), 120);
            };

            const iconTitle = document.createElement('div');
            iconTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
            iconTitle.textContent = t('panel.releaseIconThisRepo');
            sidePanel.appendChild(iconTitle);

            const lockRow = document.createElement('div');
            lockRow.style.display = 'flex';
            lockRow.style.alignItems = 'center';
            lockRow.style.gap = '6px';
            lockRow.style.marginBottom = '8px';

            const lockBtn = document.createElement('button');
            lockBtn.type = 'button';
            lockBtn.className = 'gh-remark-icon-lock-btn';
            lockBtn.innerHTML = LOCK_ICON_SVG;
            lockRow.appendChild(lockBtn);

            const lockStatus = document.createElement('span');
            lockStatus.className = 'gh-remark-icon-lock-status';
            lockRow.appendChild(lockStatus);

            sidePanel.appendChild(lockRow);

            const iconGrid = document.createElement('div');
            iconGrid.className = 'gh-remark-icon-picker-grid';
            const currentIconKey = RemarkStorage.getRawIcon(username);

            RELEASE_ICON_LIBRARY.forEach(entry => {
                if (entry.div) {
                    const header = document.createElement('div');
                    header.className = 'gh-remark-icon-picker-header';
                    header.textContent = entry.div;
                    iconGrid.appendChild(header);
                    return;
                }
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'gh-remark-icon-picker-btn' +
                    (entry.id === currentIconKey ? ' selected' : '');
                btn.title = entry.label;
                btn.style.color = entry.color || '#9198a1';
                btn.innerHTML = entry.svg;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    flashIconPress(btn);
                    RemarkStorage.updateIcon(username, entry.id);
                    if (releaseIconEl) releaseIconEl.setIcon(entry.id);
                    iconGrid.querySelectorAll('.gh-remark-icon-picker-btn')
                        .forEach(b => b.classList.toggle('selected', b === btn));
                };
                iconGrid.appendChild(btn);
            });

            sidePanel.appendChild(iconGrid);

            const lockIconTitle = document.createElement('div');
            lockIconTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section gh-remark-icon-title-fade';
            lockIconTitle.textContent = t('panel.lockedIconAllRepos');
            sidePanel.appendChild(lockIconTitle);

            const lockIconGrid = document.createElement('div');
            lockIconGrid.className = 'gh-remark-icon-picker-grid';
            const lockableIcons = RELEASE_ICON_LIBRARY.filter(e => !e.div);

            RELEASE_ICON_LIBRARY.forEach(entry => {
                if (entry.div) {
                    const header = document.createElement('div');
                    header.className = 'gh-remark-icon-picker-header';
                    header.textContent = entry.div;
                    lockIconGrid.appendChild(header);
                    return;
                }
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'gh-remark-icon-picker-btn';
                btn.title = entry.label;
                btn.style.color = entry.color || '#9198a1';
                btn.innerHTML = entry.svg;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    flashIconPress(btn);
                    DisplaySettingsStorage.update({ iconLockKey: entry.id });
                    lockIconGrid.querySelectorAll('.gh-remark-icon-picker-btn')
                        .forEach(b => b.classList.toggle('selected', b === btn));
                    showReloadHint();
                };
                lockIconGrid.appendChild(btn);
            });
            sidePanel.appendChild(lockIconGrid);

            let renderLockIconGridGen = 0;
            const renderLockIconGrid = (animate) => {
                const locked = DisplaySettingsStorage.get().iconLockEnabled;

                if (!animate) {
                    lockIconTitle.style.display = locked ? '' : 'none';
                    lockIconGrid.style.display = locked ? '' : 'none';
                    iconGrid.style.display = locked ? 'none' : '';
                } else {
                    const myGen = ++renderLockIconGridGen;
                    const outgoingGrid = locked ? iconGrid : lockIconGrid;
                    const incomingGrid = locked ? lockIconGrid : iconGrid;
                    const lockIconTitleEntering = locked;

                    [iconGrid, lockIconGrid].forEach(g => {
                        g.classList.remove('gh-remark-icon-picker-grid--leaving', 'gh-remark-icon-picker-grid--entering');
                        g.style.top = '';
                        g.style.left = '';
                        g.style.width = '';
                    });

                    outgoingGrid.style.top = outgoingGrid.offsetTop + 'px';
                    outgoingGrid.style.left = outgoingGrid.offsetLeft + 'px';
                    outgoingGrid.style.width = outgoingGrid.offsetWidth + 'px';
                    outgoingGrid.classList.add('gh-remark-icon-picker-grid--leaving');

                    if (lockIconTitleEntering) {
                        lockIconTitle.style.display = '';
                        lockIconTitle.style.opacity = '0';
                        requestAnimationFrame(() => {
                            if (myGen !== renderLockIconGridGen) return;
                            lockIconTitle.style.opacity = '1';
                        });
                    } else {
                        lockIconTitle.style.opacity = '0';
                    }

                    incomingGrid.style.display = '';
                    incomingGrid.classList.add('gh-remark-icon-picker-grid--entering');

                    requestAnimationFrame(() => {
                        incomingGrid.classList.remove('gh-remark-icon-picker-grid--entering');
                    });

                    setTimeout(() => {
                        if (myGen !== renderLockIconGridGen) return;
                        outgoingGrid.style.display = 'none';
                        outgoingGrid.classList.remove('gh-remark-icon-picker-grid--leaving');
                        outgoingGrid.style.top = '';
                        outgoingGrid.style.left = '';
                        outgoingGrid.style.width = '';
                        if (!lockIconTitleEntering) {
                            lockIconTitle.style.display = 'none';
                            lockIconTitle.style.opacity = '';
                        }
                    }, 150);
                }

                if (locked) {
                    const savedLockKey = DisplaySettingsStorage.get().iconLockKey || DEFAULT_RELEASE_ICON_KEY;
                    lockIconGrid.querySelectorAll('.gh-remark-icon-picker-btn').forEach((b, i) => {
                        b.classList.toggle('selected', lockableIcons[i].id === savedLockKey);
                    });
                } else {
                    const currentIconKey = RemarkStorage.getRawIcon(username);
                    iconGrid.querySelectorAll('.gh-remark-icon-picker-btn').forEach((b, i) => {
                        b.classList.toggle('selected', lockableIcons[i].id === currentIconKey);
                    });
                }
            };
            renderLockIconGrid(false);

            const renderLockUi = () => {
                const locked = DisplaySettingsStorage.get().iconLockEnabled;
                lockBtn.classList.toggle('locked', locked);
                lockStatus.classList.toggle('locked', locked);
                lockBtn.title = locked
                    ? t('panel.lockTitleLocked')
                    : t('panel.lockTitleUnlocked');
                lockStatus.textContent = locked ? t('panel.locked') : t('panel.unlocked');
            };
            renderLockUi();

            lockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const nowLocked = !DisplaySettingsStorage.get().iconLockEnabled;
                DisplaySettingsStorage.update({ iconLockEnabled: nowLocked });
                renderLockUi();
                renderLockIconGrid(true);
                showReloadHint();
            });
        }

        const statsTitle = document.createElement('div');
        statsTitle.className = 'gh-remark-cat-panel-title';
        statsTitle.textContent = t('stats.title');
        tab2Content.appendChild(statsTitle);

        const statsSection = document.createElement('div');
        statsSection.className = 'gh-remark-other-section';
        tab2Content.appendChild(statsSection);

        const renderStats = () => {
            statsSection.innerHTML = '';
            const { total, byCategory } = computeRemarkStats();

            const totalLine = document.createElement('div');
            totalLine.className = 'gh-remark-other-hint';
            totalLine.style.marginTop = '0';
            totalLine.style.marginBottom = '8px';
            totalLine.textContent = total === 0
                ? t('stats.noneYet')
                : t('stats.notedCount', { n: total, s: total === 1 ? '' : 's' });
            statsSection.appendChild(totalLine);

            if (total === 0) return;

            const rows = Object.keys(byCategory)
                .map(key => ({ key, count: byCategory[key] }))
                .sort((a, b) => b.count - a.count);

            rows.forEach(({ key, count }) => {
                const cat = key ? findCategory(key) : null;
                const label = key ? (cat ? cat.label : key) : t('category.noCategory');

                const row = document.createElement('div');
                row.className = 'gh-remark-stat-row';

                const labelEl = document.createElement('div');
                labelEl.className = 'gh-remark-stat-label';
                labelEl.textContent = label;
                labelEl.title = label;
                row.appendChild(labelEl);

                const track = document.createElement('div');
                track.className = 'gh-remark-stat-bar-track';
                const fill = document.createElement('div');
                fill.className = 'gh-remark-stat-bar-fill';
                fill.style.width = Math.round((count / total) * 100) + '%';
                if (cat) fill.style.background = cat.color;
                track.appendChild(fill);
                row.appendChild(track);

                const countEl = document.createElement('div');
                countEl.className = 'gh-remark-stat-count';
                countEl.textContent = String(count);
                row.appendChild(countEl);

                statsSection.appendChild(row);
            });
        };
        renderStats();

        const langTitle = document.createElement('div');
        langTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        langTitle.textContent = t('language.title');
        tab2Content.appendChild(langTitle);

        const langSection = document.createElement('div');
        langSection.className = 'gh-remark-other-section';
        tab2Content.appendChild(langSection);

        const langSelectRow = document.createElement('div');
        langSelectRow.className = 'gh-remark-cat-panel-row';
        const langSelectLabel = document.createElement('span');
        langSelectLabel.className = 'gh-remark-cat-panel-row-label';
        langSelectLabel.textContent = t('language.current');
        langSelectRow.appendChild(langSelectLabel);

        const langSelect = document.createElement('select');
        langSelect.className = 'gh-remark-lang-select';
        langSelectRow.appendChild(langSelect);

        const langDeleteBtn = document.createElement('button');
        langDeleteBtn.type = 'button';
        langDeleteBtn.className = 'gh-remark-lang-delete-btn';
        langDeleteBtn.textContent = '✕';
        langDeleteBtn.title = t('language.deleteCustom');
        langSelectRow.appendChild(langDeleteBtn);

        langSection.appendChild(langSelectRow);

        const renderLangOptions = () => {
            langSelect.innerHTML = '';
            const { current, custom } = LanguageStorage.get();
            Object.keys(BUILTIN_LANGUAGES).forEach((code) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = `${BUILTIN_LANGUAGES[code].flag} ${BUILTIN_LANGUAGES[code].name}`;
                langSelect.appendChild(opt);
            });
            Object.keys(custom).forEach((code) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = `🌐 ${custom[code].name}`;
                langSelect.appendChild(opt);
            });
            langSelect.value = BUILTIN_LANGUAGES[current] || custom[current] ? current : 'en';
            langDeleteBtn.style.display = BUILTIN_LANGUAGES[current] ? 'none' : '';
        };
        renderLangOptions();

        langSelect.addEventListener('change', () => {
            LanguageStorage.setCurrent(langSelect.value);
            closePanel();
            openCategoryPanel(anchorWrapper, gearBtn, onChange, username, releaseIconEl);
        });

        langDeleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const { current, custom } = LanguageStorage.get();
            if (BUILTIN_LANGUAGES[current]) return;
            const name = (custom[current] && custom[current].name) || current;
            const proceed = await showConfirmModal(
                t('language.deleteConfirmTitle', { name }),
                t('language.deleteConfirmBody'),
                true
            );
            if (!proceed) return;
            LanguageStorage.removeCustom(current);
            closePanel();
            openCategoryPanel(anchorWrapper, gearBtn, onChange, username, releaseIconEl);
        });

        const langBtnRow = document.createElement('div');
        langBtnRow.className = 'gh-remark-other-btn-row';

        const langExportBtn = document.createElement('button');
        langExportBtn.type = 'button';
        langExportBtn.textContent = t('language.export');
        langBtnRow.appendChild(langExportBtn);

        const langImportBtn = document.createElement('button');
        langImportBtn.type = 'button';
        langImportBtn.textContent = t('language.import');
        langBtnRow.appendChild(langImportBtn);

        const langImportFileInput = document.createElement('input');
        langImportFileInput.type = 'file';
        langImportFileInput.accept = 'application/json';
        langImportFileInput.style.display = 'none';
        langBtnRow.appendChild(langImportFileInput);

        langSection.appendChild(langBtnRow);

        const langHint = document.createElement('div');
        langHint.className = 'gh-remark-other-hint';
        langHint.textContent = t('language.exportHint');
        langSection.appendChild(langHint);

        langExportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportLanguageTemplate();
        });

        langImportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            langImportFileInput.value = '';
            langImportFileInput.click();
        });

        langImportFileInput.addEventListener('change', () => {
            const file = langImportFileInput.files && langImportFileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const result = parseLanguageImportFile(String(reader.result));
                if (!result.ok) {
                    langHint.classList.add('gh-remark-other-hint--error');
                    langHint.textContent = result.error;
                    return;
                }
                LanguageStorage.addCustom(result.code, result.name, result.strings);
                LanguageStorage.setCurrent(result.code);
                langHint.classList.remove('gh-remark-other-hint--error');
                langHint.textContent = t('language.importSuccess', { name: result.name });
                closePanel();
                openCategoryPanel(anchorWrapper, gearBtn, onChange, username, releaseIconEl);
            };
            reader.readAsText(file);
        });

        const ieTitle = document.createElement('div');
        ieTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        ieTitle.textContent = t('backup.title');
        tab2Content.appendChild(ieTitle);

        const ieSection = document.createElement('div');
        ieSection.className = 'gh-remark-other-section';
        tab2Content.appendChild(ieSection);

        const ieBtnRow = document.createElement('div');
        ieBtnRow.className = 'gh-remark-other-btn-row';
        ieBtnRow.style.marginTop = '0';

        const exportBtn = document.createElement('button');
        exportBtn.type = 'button';
        exportBtn.textContent = t('backup.export');
        ieBtnRow.appendChild(exportBtn);

        const importBtn = document.createElement('button');
        importBtn.type = 'button';
        importBtn.textContent = t('backup.import');
        ieBtnRow.appendChild(importBtn);

        const importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.accept = 'application/json';
        importFileInput.style.display = 'none';
        ieBtnRow.appendChild(importFileInput);

        ieSection.appendChild(ieBtnRow);

        const ieHint = document.createElement('div');
        ieHint.className = 'gh-remark-other-hint';
        ieSection.appendChild(ieHint);

        const renderExportHint = () => {
            const lastExport = GM_getValue(LAST_EXPORT_STORAGE_KEY, null);
            ieHint.classList.remove('gh-remark-other-hint--error');
            if (!lastExport) {
                ieHint.textContent = t('backup.neverExported');
                return;
            }
            const d = new Date(lastExport);
            const pad = (n) => String(n).padStart(2, '0');
            const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            ieHint.textContent = t('backup.lastExported', { date: dateStr });
        };
        renderExportHint();

        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportAllSettings();
            renderExportHint();
        });

        importBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            importFileInput.value = '';
            importFileInput.click();
        });

        importFileInput.addEventListener('change', () => {
            const file = importFileInput.files && importFileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async () => {
                const result = parseImportFile(String(reader.result));
                if (!result.ok) {
                    ieHint.classList.add('gh-remark-other-hint--error');
                    ieHint.textContent = result.error;
                    return;
                }

                const remarkCount = result.data.remarks.length;
                const proceed = await showConfirmModal(
                    t('backup.replaceConfirmTitle'),
                    t('backup.replaceConfirmBody', { n: remarkCount, s: remarkCount === 1 ? '' : 's' }),
                    true
                );
                if (!proceed) return;

                importAllSettings(result.data);
                location.reload();
            };
            reader.readAsText(file);
        });

        const resetTitle = document.createElement('div');
        resetTitle.className = 'gh-remark-cat-panel-title gh-remark-cat-panel-title--section';
        resetTitle.textContent = t('reset.title');
        tab2Content.appendChild(resetTitle);

        const resetSection = document.createElement('div');
        resetSection.className = 'gh-remark-other-section';
        tab2Content.appendChild(resetSection);

        const resetBtnRow = document.createElement('div');
        resetBtnRow.className = 'gh-remark-other-btn-row';
        resetBtnRow.style.marginTop = '0';
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'gh-remark-other-btn-danger';
        resetBtn.textContent = t('reset.everything');
        resetBtnRow.appendChild(resetBtn);
        resetSection.appendChild(resetBtnRow);

        resetBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const proceed = await showConfirmModal(
                t('reset.confirmTitle'),
                t('reset.confirmBody'),
                true
            );
            if (!proceed) return;

            resetAllToDefaults();
            location.reload();
        });

        switchTab(1);

        const isOrgReposPage = () => {
            const rule = PAGE_CONTAINER_RULES.find(r => r.kind === 'org-repos');
            return !!(rule && rule.match());
        };
        const useFixedPositioning = isOrgReposPage();

        gearBtn.parentElement.style.position =
            gearBtn.parentElement.style.position || 'relative';
        panel.classList.add('gh-remark-panel-entering');
        gearBtn.insertAdjacentElement('afterend', panel);

        if (useFixedPositioning) {
            const gr = gearBtn.getBoundingClientRect();
            panel.style.position = 'fixed';
            panel.style.top = `${gr.bottom + 4}px`;
            panel.style.left = `${gr.left}px`;
        }

        if (sidePanel) {
            sidePanel.classList.add('gh-remark-panel-entering');
            gearBtn.parentElement.appendChild(sidePanel);
            const SIDE_PANEL_WIDTH = 300;
            const sideWidthNeeded = SIDE_PANEL_WIDTH + 4;

            if (useFixedPositioning) {
                sidePanel.style.position = 'fixed';
                const pr = panel.getBoundingClientRect();
                if (pr.left < sideWidthNeeded) {
                    sidePanel.classList.add('gh-remark-icon-side-panel--below');
                    sidePanel.style.left = `${pr.left}px`;
                    sidePanel.style.top = `${pr.bottom + 4}px`;
                } else {
                    sidePanel.style.left = `${pr.left - SIDE_PANEL_WIDTH - 4}px`;
                    sidePanel.style.top = `${pr.top}px`;
                }
            } else {
                const wrapperLeftOnScreen = gearBtn.parentElement.getBoundingClientRect().left;
                if (wrapperLeftOnScreen + panel.offsetLeft < sideWidthNeeded) {
                    sidePanel.classList.add('gh-remark-icon-side-panel--below');
                    sidePanel.style.left = panel.offsetLeft + 'px';
                    sidePanel.style.top = (panel.offsetTop + panel.offsetHeight + 4) + 'px';
                } else {
                    sidePanel.style.left = (panel.offsetLeft - SIDE_PANEL_WIDTH - 4) + 'px';
                    sidePanel.style.top = panel.offsetTop + 'px';
                }
            }
        }

        requestAnimationFrame(() => {
            panel.classList.remove('gh-remark-panel-entering');
            if (sidePanel) sidePanel.classList.remove('gh-remark-panel-entering');
        });

        let isClosing = false;
        function closePanel() {
            if (isClosing) return;
            isClosing = true;
            document.removeEventListener('click', onOutsideClick, true);
            panel.classList.add('gh-remark-panel-closing');
            if (sidePanel) sidePanel.classList.add('gh-remark-panel-closing');
            setTimeout(() => {
                panel.remove();
                if (sidePanel) sidePanel.remove();
            }, 150);
        }
        panel._ghRemarkCleanup = closePanel;
        const onOutsideClick = (e) => {
            if (panel.contains(e.target) || e.target === gearBtn) return;
            if (sidePanel && sidePanel.contains(e.target)) return;
            closePanel();
        };
        setTimeout(() => document.addEventListener('click', onOutsideClick, true), 0);
    }

    function isUserProfilePage() {
        return !!document.querySelector('.vcard-names .p-nickname');
    }

    function injectUserProfileNameEdit() {
        if (!isUserProfilePage()) return;
        const heading = document.querySelector('h1.vcard-names');
        const nameEl = heading && heading.querySelector('.p-name');
        const nicknameEl = heading && heading.querySelector('.p-nickname');
        if (!nameEl || !nicknameEl || heading.dataset.remarkNameEditDone) return;
        heading.dataset.remarkNameEditDone = '1';

        const username = nicknameEl.textContent.trim();
        const githubName = nameEl.textContent.trim();
        const nameStyle = getComputedStyle(nameEl);
        const nameElFont = {
            fontSize: nameStyle.fontSize,
            fontWeight: nameStyle.fontWeight,
            lineHeight: nameStyle.lineHeight,
            color: nameStyle.color
        };

        const wrap = document.createElement('span');
        wrap.className = 'gh-remark-profile-name-wrap';
        nameEl.replaceWith(wrap);

        const renderView = () => {
            wrap.innerHTML = '';
            const custom = UserDisplayNameStorage.get(username);
            nameEl.textContent = custom || githubName;
            wrap.appendChild(nameEl);

            const editBtn = document.createElement('span');
            editBtn.className = 'gh-remark-profile-name-edit';
            editBtn.title = t('remark.editName');
            editBtn.innerHTML = EDIT_ICON_SVG;
            editBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderEdit();
            };
            wrap.appendChild(editBtn);
        };

        const renderEdit = () => {
            wrap.innerHTML = '';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'gh-remark-profile-name-input';
            Object.assign(input.style, nameElFont);
            input.value = UserDisplayNameStorage.get(username) || githubName;
            wrap.appendChild(input);
            input.focus();
            input.select();

            let settled = false;
            const commit = () => {
                if (settled) return;
                settled = true;
                const trimmedInput = input.value.trim();
                UserDisplayNameStorage.set(username, trimmedInput === githubName ? '' : trimmedInput);
                renderView();
            };
            const cancel = () => {
                if (settled) return;
                settled = true;
                renderView();
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); commit(); }
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); }
            });
            input.addEventListener('blur', commit);
            input.addEventListener('click', (e) => e.stopPropagation());
        };

        renderView();
    }

    const PAGE_CONTAINER_RULES = [
        {
            kind: 'starred',
            settingsKey: 'enableStarredPage',
            match: () => new URLSearchParams(location.search).get('tab') === 'stars',
            container: () => document.getElementById('user-starred-repos')
        },
        {
            kind: 'repositories',
            settingsKey: 'enableRepositoriesPage',
            match: () => new URLSearchParams(location.search).get('tab') === 'repositories',
            container: () => document.querySelector('[id*="repositories" i]')
        },
        {
            kind: 'org-repos',
            settingsKey: 'enableOrgReposPage',
            match: () => /^\/orgs\/[^\/]+\/repositories/.test(location.pathname),
            container: () => document.querySelector('[id$="-list-view-container"]')
        }
    ];

    function getSupportedListContainer() {
        const rule = PAGE_CONTAINER_RULES.find(r => r.match());
        if (!rule) return null;
        if (!DisplaySettingsStorage.get()[rule.settingsKey]) return null;
        const container = rule.container();
        return container ? { container, kind: rule.kind } : null;
    }

    const RELEASE_ICON_HOVER_ANIMATIONS = [
        'gh-remark-icon-hop',
        'gh-remark-icon-breathe',
        'gh-remark-icon-bounce',
        'gh-remark-icon-spinpop'
    ];

    function buildReleaseIcon(href, iconKey) {
        const icon = document.createElement('a');
        icon.href = href.replace(/\/+$/, '') + '/releases';
        icon.title = t('panel.viewReleases');
        icon.setAttribute('aria-label', t('panel.viewReleases') + ' ' + href.slice(1));
        icon.className = 'gh-remark-release-icon';
        icon.style.cssText =
            'display:inline-flex;align-items:center;justify-content:center;' +
            'width:26px;height:26px;margin-right:8px;vertical-align:middle;' +
            'line-height:0;opacity:.5;' +
            'border-radius:50%;' +
            'background:radial-gradient(circle,' +
            'color-mix(in srgb,currentColor calc(35% + var(--gh-remark-icon-glow,4px) * 3%),transparent) 0%,' +
            'color-mix(in srgb,currentColor calc(12% + var(--gh-remark-icon-glow,4px) * 2%),transparent) ' +
            'calc(40% + var(--gh-remark-icon-glow,4px) * 1.5%),' +
            'transparent calc(55% + var(--gh-remark-icon-glow,4px) * 3%));';
        icon.setIcon = (key) => {
            const ic = resolveReleaseIcon(key);
            icon.innerHTML = ic.svg;
            const svgEl = icon.querySelector('svg');
            if (svgEl) { svgEl.setAttribute('width', '26'); svgEl.setAttribute('height', '26'); }
            icon.style.color = ic.color || 'var(--fgColor-muted,#6e7681)';
        };
        icon.setIcon(iconKey);
        icon.addEventListener('mouseenter', () => {
            const pick = RELEASE_ICON_HOVER_ANIMATIONS[
                Math.floor(Math.random() * RELEASE_ICON_HOVER_ANIMATIONS.length)
            ];
            icon.classList.remove(...RELEASE_ICON_HOVER_ANIMATIONS);
            void icon.offsetWidth;
            icon.classList.add(pick);
        });
        return icon;
    }

    function buildRatingStars(username, initialRating) {
        const row = document.createElement('span');
        row.className = 'gh-remark-rating-row';

        let currentRating = initialRating || 0;
        const buttons = [];

        const renderStars = () => {
            buttons.forEach((btn, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= currentRating;
                btn.classList.toggle('filled', isFilled);
                btn.innerHTML = isFilled ? RATING_STAR_FILLED_SVG : RATING_STAR_OUTLINE_SVG;
                btn.title = t('remark.rateStars', { n: starValue, s: starValue === 1 ? '' : 's' });
            });
        };

        for (let i = 0; i < 5; i++) {
            const starValue = i + 1;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gh-remark-rating-star';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentRating = (starValue === currentRating) ? 0 : starValue;
                RemarkStorage.updateRating(username, currentRating);
                renderStars();

                const pulseUpTo = Math.max(starValue, 1);
                buttons.slice(0, pulseUpTo).forEach(b => {
                    b.classList.remove('pulse');
                    void b.offsetWidth;
                    b.classList.add('pulse');
                });
            });
            buttons.push(btn);
            row.appendChild(btn);
        }

        renderStars();
        return row;
    }

    function buildRemarkBadge(username, initialRemark, initialCategoryKey, initialTextColor, releaseIconEl) {
        const wrapper = document.createElement('span');
        wrapper.className = 'gh-remark-badge';
        wrapper.style.position = 'relative';

        let currentRemark = initialRemark || '';
        let currentCategoryKey = initialCategoryKey || '';
        let currentTextColor = initialTextColor || DEFAULT_REMARK_TEXT_COLOR;
        let isEditing = false;

        const renderView = () => {
            isEditing = false;
            wrapper.innerHTML = '';

            let pillRendered = false;
            if (currentCategoryKey) {
                const pill = buildCategoryPill(currentCategoryKey);
                if (pill) {
                    wrapper.appendChild(pill);
                    pillRendered = true;
                }
            }

            if (pillRendered && currentRemark) {
                const sep = document.createElement('span');
                sep.className = 'gh-remark-badge-sep';
                sep.textContent = '－';
                wrapper.appendChild(sep);
            }

            if (currentRemark) {
                const textSpan = document.createElement('span');
                textSpan.className = 'gh-remark-badge-text';
                textSpan.style.setProperty('--remark-color', currentTextColor);
                textSpan.textContent = currentRemark;
                textSpan.title = currentRemark;
                wrapper.appendChild(textSpan);
            }

            const editSpan = document.createElement('span');
            editSpan.className = 'gh-remark-badge-edit';
            editSpan.title = t('remark.editNote');
            editSpan.innerHTML = EDIT_ICON_SVG;

            const triggerEdit = (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderEdit();
            };
            editSpan.onclick = triggerEdit;
            wrapper.appendChild(editSpan);
        };

        const renderEdit = () => {
            if (isEditing) return;
            isEditing = true;
            wrapper.innerHTML = '';

            let pendingCategoryKey = currentCategoryKey;

            const selectHost = document.createElement('span');
            selectHost.style.display = 'inline-block';

            const gearBtn = document.createElement('button');
            gearBtn.type = 'button';
            gearBtn.className = 'gh-remark-gear-btn';
            gearBtn.title = t('remark.manageTemplates');
            gearBtn.textContent = GEAR_BUTTON_TEXT;

            const openPanel = () => {
                openCategoryPanel(wrapper, gearBtn, rebuildSelect, username, releaseIconEl);
            };
            gearBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openPanel();
            };

            const onCategoryPicked = (key) => {
                pendingCategoryKey = key;
            };

            const rebuildSelect = () => {
                selectHost.innerHTML = '';
                selectHost.appendChild(buildCategorySelect(pendingCategoryKey, onCategoryPicked));
            };
            rebuildSelect();
            wrapper.appendChild(selectHost);
            wrapper.appendChild(gearBtn);

            const remarkInput = document.createElement('input');
            remarkInput.type = 'text';
            remarkInput.value = currentRemark;
            remarkInput.className = 'gh-remark-badge-input';
            remarkInput.placeholder = t('remark.notePlaceholder');
            remarkInput.style.width = '120px';
            wrapper.appendChild(remarkInput);
            remarkInput.focus();

            const colorWrap = document.createElement('span');
            colorWrap.className = 'gh-remark-badge-color-wrap';

            const colorSwatch = document.createElement('input');
            colorSwatch.type = 'color';
            colorSwatch.className = 'gh-remark-badge-color-swatch';
            colorSwatch.value = currentTextColor;
            colorSwatch.title = t('remark.noteTextColor');
            colorWrap.appendChild(colorSwatch);

            const colorResetBtn = document.createElement('button');
            colorResetBtn.type = 'button';
            colorResetBtn.className = 'gh-remark-reset-btn';
            colorResetBtn.title = t('panel.resetToDefault');
            colorResetBtn.innerHTML = RESET_ICON_SVG;
            colorResetBtn.addEventListener('click', () => {
                colorSwatch.value = DEFAULT_REMARK_TEXT_COLOR;
            });
            colorWrap.appendChild(colorResetBtn);

            wrapper.appendChild(colorWrap);

            let isCancelled = false;
            let isSaving = false;

            const showSavedMessage = (text) => {
                const existing = wrapper.parentNode &&
                    wrapper.parentNode.querySelector(':scope > .gh-remark-saved-msg');
                if (existing) existing.remove();
                if (!wrapper.parentNode) return;

                const msg = document.createElement('span');
                msg.className = 'gh-remark-saved-msg';
                msg.textContent = text;
                wrapper.insertAdjacentElement('afterend', msg);

                const rect = wrapper.getBoundingClientRect();
                msg.style.left = `${rect.right + 6}px`;
                msg.style.top = `${rect.top + rect.height / 2}px`;

                setTimeout(() => msg.classList.add('gh-remark-saved-msg--fade'), 1500);
                setTimeout(() => msg.remove(), 1800);
            };

            const save = async () => {
                if (isCancelled || isSaving) return;
                isSaving = true;

                const newRemark = remarkInput.value.trim();
                const newCategoryKey = pendingCategoryKey;
                const newTextColor = colorSwatch.value;

                const dirty = newCategoryKey !== currentCategoryKey ||
                    newRemark !== currentRemark ||
                    newTextColor !== currentTextColor;

                isCancelled = true;
                if (dirty) {
                    currentCategoryKey = newCategoryKey;
                    currentRemark = newRemark;
                    currentTextColor = newTextColor;
                    RemarkStorage.update(username, currentRemark, currentCategoryKey, currentTextColor);
                    showSavedMessage('Saved');
                }
                document.removeEventListener('click', onOutsideClick, true);
                renderView();
            };

            const cancel = () => {
                if (isCancelled) return;
                isCancelled = true;
                document.removeEventListener('click', onOutsideClick, true);
                renderView();
            };

            const onOutsideClick = (e) => {
                if (wrapper.contains(e.target)) return;
                save();
            };
            setTimeout(() => {
                if (!isCancelled) document.addEventListener('click', onOutsideClick, true);
            }, 0);

            wrapper.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') save();
                else if (e.key === 'Escape') cancel();
            });
        };

        renderView();
        return wrapper;
    }

    function injectReleaseIcons() {
        const resolved = getSupportedListContainer();
        if (!resolved) return;
        const { container, kind } = resolved;

        const titleSelector = kind === 'org-repos' ? 'h4 a[href]' : 'h3 a[href]';

        container
            .querySelectorAll(titleSelector)
            .forEach(link => {
                if (link.dataset.releasesIconDone) return;

                const href = link.getAttribute('href') || '';
                if (!/^\/[^\/?#]+\/[^\/?#]+$/.test(href)) return;

                link.dataset.releasesIconDone = '1';

                const remarkKey = href.replace(/^\//, '');
                const existing = remarkKey ? RemarkStorage.get(remarkKey) : null;

                const releaseIcon = buildReleaseIcon(href, existing?.iconKey);
                link.parentNode.insertBefore(releaseIcon, link);

                if (remarkKey) {
                    const badge = buildRemarkBadge(
                        remarkKey, existing?.remark, existing?.groupName,
                        existing?.textColor, releaseIcon
                    );

                    let groupingRoot;
                    if (kind === 'org-repos') {
                        const heading = link.closest('h4');
                        groupingRoot = heading ? heading.parentElement : null;
                    } else {
                        groupingRoot = link.parentElement;
                    }

                    const settings = DisplaySettingsStorage.get();
                    if (settings.remarkBeforeVisibilityLabel) {
                        link.insertAdjacentElement('afterend', badge);
                    } else if (groupingRoot) {
                        groupingRoot.appendChild(badge);
                    } else {
                        link.insertAdjacentElement('afterend', badge);
                    }

                    if (settings.ratingStarsEnabled) {
                        const ratingRow = buildRatingStars(remarkKey, existing?.rating);
                        badge.insertAdjacentElement('afterend', ratingRow);
                    }

                    if (groupingRoot) groupingRoot.classList.add('gh-remark-heading');
                }
            });
    }

    applyDisplaySettings();

    setPanelScaleLevel(getPanelScaleLevel());

    injectReleaseIcons();
    injectUserProfileNameEdit();

    let scanScheduled = false;
    function scheduleScan() {
        if (scanScheduled) return;
        scanScheduled = true;
        queueMicrotask(() => {
            scanScheduled = false;
            injectReleaseIcons();
            injectUserProfileNameEdit();
        });
    }

    new MutationObserver(scheduleScan)
        .observe(document.body, { childList: true, subtree: true });
})();