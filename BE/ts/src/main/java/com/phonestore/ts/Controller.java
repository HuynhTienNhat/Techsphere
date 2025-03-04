package com.phonestore.ts;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("test")
public class Controller {
    @GetMapping("")
    public String getMethodName() {
        return "Hello World!";
    }
    
}
