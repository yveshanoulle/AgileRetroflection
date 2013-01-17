//
//  arotdViewController.m
//  arotd
//
//  Created by Yaal on 15/04/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "arotdViewController.h"

@implementation arotdViewController


-(id) init {
	self = [super init];
	
	webView = [[UIWebView alloc] initWithFrame:CGRectMake(.0, 20.0, 320.0, 480.0 - 20.0)];
    webView.backgroundColor = [UIColor viewFlipsideBackgroundColor];
	webView.delegate = self;
	webView.scalesPageToFit = YES;
	[webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"index"
																											 ofType:@"html"
																										inDirectory:@"web"]]
										  cachePolicy:NSURLRequestUseProtocolCachePolicy 
									  timeoutInterval:20.0]];
	[self.view addSubview:splashView];
	return self;
}

- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
	NSURL *url = [request URL];
	if ([[url host] isEqualToString:@"twitter.com"]
		|| [[url host] isEqualToString:@"www.yaal.fr"]
		|| [[url scheme] isEqualToString:@"mailto"]) {
		[[UIApplication sharedApplication] openURL:url];
		return NO;
	} else if ([[url scheme] isEqualToString:@"loaded"]) {
		[self.view addSubview:webView];
		[splashView removeFromSuperview];
		return NO;
	}
	return YES;
}

- (void)dealloc {
	[webView release];
	[super dealloc];
}

@end
