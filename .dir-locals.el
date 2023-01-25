;;; Directory Local Variables
;;; For more information see (info "(emacs) Directory Variables")

((typescript-mode . ((typescript-indent-level . 2)
                     (eval . (progn
                               (when (fboundp 'deno-fmt-mode)
                                 (deno-fmt-mode -1))
                               (when (fboundp 'prettier-js-mode)
                                 (prettier-js-mode 1))))))
 (auto-mode-alist . (("\\.tsx\\'" . typescript-tsx-mode)
                     ("\\.mdx\\'" . markdown-mode))))
